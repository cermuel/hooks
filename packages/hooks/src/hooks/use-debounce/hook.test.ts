import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createDebounceTimer,
  defaultDebounceDelay,
  resolveDebounceDelay,
} from "./core";
import metadata from "./meta";

describe(metadata.name, () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("has the expected generated configuration", () => {
    expect(metadata).toMatchObject({
      name: "useDebounce",
      slug: "use-debounce",
      frameworks: ["react", "vue"],
    });
  });

  it("falls back to a safe default delay", () => {
    expect(resolveDebounceDelay(Number.NaN)).toBe(defaultDebounceDelay);
    expect(resolveDebounceDelay(Number.POSITIVE_INFINITY)).toBe(
      defaultDebounceDelay
    );
  });

  it("normalizes negative delays to run on the next timer tick", () => {
    expect(resolveDebounceDelay(-100)).toBe(0);
  });

  it("runs the callback after the delay", () => {
    vi.useFakeTimers();

    const callback = vi.fn();

    createDebounceTimer(callback, 100);
    vi.advanceTimersByTime(99);

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("cancels pending callbacks", () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const cancel = createDebounceTimer(callback, 100);

    cancel();
    vi.advanceTimersByTime(100);

    expect(callback).not.toHaveBeenCalled();
  });
});
