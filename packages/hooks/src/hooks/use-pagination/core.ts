export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function getPaginationRange(page: number, pageCount: number, siblingCount = 1): Array<number | "..."> {
  const totalNumbers = siblingCount * 2 + 5;
  if (pageCount <= totalNumbers) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }
  const left = Math.max(page - siblingCount, 1);
  const right = Math.min(page + siblingCount, pageCount);
  const showLeftDots = left > 2;
  const showRightDots = right < pageCount - 1;
  if (!showLeftDots && showRightDots) {
    return [...Array.from({ length: 3 + siblingCount * 2 }, (_, index) => index + 1), "...", pageCount];
  }
  if (showLeftDots && !showRightDots) {
    return [1, "...", ...Array.from({ length: 3 + siblingCount * 2 }, (_, index) => pageCount - (3 + siblingCount * 2) + index + 1)];
  }
  return [1, "...", ...Array.from({ length: right - left + 1 }, (_, index) => left + index), "...", pageCount];
}

export interface PaginationOptions {
  initialPage?: number;
  pageSize?: number;
  siblingCount?: number;
}
