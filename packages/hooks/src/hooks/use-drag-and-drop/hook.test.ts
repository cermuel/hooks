import { describe, expect, it } from "vitest";

import metadata from "./meta";

describe(metadata.name, () => {
  it("has the expected generated configuration", () => {
    expect(metadata).toMatchObject({
      name: "useDragAndDrop",
      slug: "use-drag-and-drop",
      frameworks: ["react", "vue"],
    });
  });
});
