import { describe, expect, it } from "vitest";

import metadata from "./meta";

describe(metadata.name, () => {
  it("has the expected generated configuration", () => {
    expect(metadata).toMatchObject({
      name: "usePageFocus",
      slug: "use-page-focus",
      frameworks: ["react", "vue"],
    });
  });
});
