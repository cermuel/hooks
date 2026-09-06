import { Node, Project, SyntaxKind, type Expression } from "ts-morph";

export interface HookParameter {
  name: string;
  type: string;
  default: string | null;
  required: boolean;
}

export interface HookApi {
  parameters: HookParameter[];
  returnType: string;
}

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

function resolveDefaultValue(initializer: Expression | undefined): string | null {
  if (!initializer) {
    return null;
  }

  if (Node.isIdentifier(initializer)) {
    const symbol = initializer.getSymbol();
    const aliasedSymbol = symbol?.getAliasedSymbol();
    const declarations = aliasedSymbol?.getDeclarations() ?? symbol?.getDeclarations();
    const declaration = declarations?.find(Node.isVariableDeclaration);
    const declarationInitializer = declaration?.getInitializer();

    if (declarationInitializer) {
      return declarationInitializer.getText();
    }
  }

  if (initializer.getKind() === SyntaxKind.NoSubstitutionTemplateLiteral) {
    return initializer.getText();
  }

  return initializer.getText();
}

export function extractHookApi(filePath: string, hookName: string): HookApi {
  const sourceFile =
    project.getSourceFile(filePath) ?? project.addSourceFileAtPath(filePath);

  const hookFunction = sourceFile.getFunction(hookName);

  if (!hookFunction?.isExported()) {
    throw new Error(
      `Exported function "${hookName}" was not found in ${filePath}`,
    );
  }

  const parameters = hookFunction.getParameters().map((parameter) => {
    const initializer = parameter.getInitializer();
    const typeNode = parameter.getTypeNode();

    return {
      name: parameter.getName(),
      type: typeNode?.getText() ?? parameter.getType().getText(parameter),
      default: resolveDefaultValue(initializer),
      required:
        !parameter.hasQuestionToken() &&
        !initializer &&
        !parameter.isRestParameter(),
    };
  });

  const explicitReturnType = hookFunction.getReturnTypeNode()?.getText();
  const returnType =
    explicitReturnType ?? hookFunction.getReturnType().getText(hookFunction);

  return {
    parameters,
    returnType,
  };
}
