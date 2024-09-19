export interface Size {
  width: number | null;
  height: number | null;
}

export const resizeDetector = (
  element: HTMLElement,
  callback: (size: Size) => void
): (() => void) | void => {
  if (!element) return;

  const observer = new ResizeObserver((entries) => {
    for (let entry of entries) {
      const { width, height } = entry.contentRect;
      callback({ width, height });
    }
  });

  observer.observe(element);

  return () => observer.disconnect();
};