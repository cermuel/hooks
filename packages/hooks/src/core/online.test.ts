import { describe, expect, it } from "vitest";

import { getOnlineStatus, subscribeToOnlineStatus } from "./online";

describe("online status core", () => {
  it("returns true during server rendering", () => {
    expect(getOnlineStatus()).toBe(true);
  });

  it("returns a no-op unsubscribe during server rendering", () => {
    expect(() => subscribeToOnlineStatus(() => {})).not.toThrow();
  });
});
