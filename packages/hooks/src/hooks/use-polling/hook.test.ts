import { describe, expect, it } from "vitest";

import metadata from "./meta";

describe(metadata.name, () => {
  it("has the expected generated configuration", () => {
    expect(metadata).toMatchObject({
      name: "usePolling",
      slug: "use-polling",
      frameworks: ["react", "vue"],
    });
  });
});
