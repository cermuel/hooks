import { Project } from "ts-morph";

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
      default: initializer?.getText() ?? null,
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
