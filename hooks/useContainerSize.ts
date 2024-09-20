import { useEffect, useRef, useState } from "react";

export const useContainerSize = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setSize({ width: offsetWidth, height: offsetHeight });
      }
    };

    updateSize();
    window?.addEventListener("resize", updateSize);

    return () => {
      window?.removeEventListener("resize", updateSize);
    };
  }, []);

  return { containerRef, size };
}