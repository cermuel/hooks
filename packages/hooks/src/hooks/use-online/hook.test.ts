import { describe, expect, it } from "vitest";

import metadata from "./meta";
import { getOnlineStatus, subscribeToOnlineStatus } from "./core";

describe(metadata.name, () => {
  it("has the expected generated configuration", () => {
    expect(metadata).toMatchObject({
      name: "useOnline",
      slug: "use-online",
      frameworks: ["react", "vue"],
    });
  });

  it("returns safe defaults during server rendering", () => {
    expect(getOnlineStatus()).toBe(true);
    expect(() => subscribeToOnlineStatus(() => {})).not.toThrow();
  });
});
