import { describe, expect, it } from "vitest";

import metadata from "./meta";

describe(metadata.name, () => {
  it("has the expected generated configuration", () => {
    expect(metadata).toMatchObject({
      name: "useSessionStorage",
      slug: "use-session-storage",
      frameworks: ["react", "vue"],
    });
  });
});
