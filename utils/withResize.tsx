import React, { useRef, useEffect, useState, ComponentType } from "react";
import { Size, resizeDetector } from "./resize";
// import { resizeDetector, Size } from './resize-detector';
// import { throttle } from 'throttle-debounce';

// Configuration interface for `withResize`
interface WithResizeOptions {
  monitorWidth?: boolean;
  monitorHeight?: boolean;
  refreshRate?: number;
  refreshMode?: "throttle" | "debounce";
  noPlaceholder?: boolean;
}

// Define the props that will be passed to the wrapped component
interface SizeProps {
  size: Size;
}

// Mark the function as a generic using P (or whatever variable you want)
export const withResize = <P,>(
  // Then we need to type the incoming component.
  // This creates a union type of whatever the component
  // already accepts AND our SizeProps
  WrappedComponent: React.ComponentType<P & SizeProps>,
  options: WithResizeOptions = {}
) => {
  const {
    monitorWidth = true,
    monitorHeight = true,
    refreshRate = 100,
    refreshMode = "throttle", // Default to throttle
    noPlaceholder = false,
  } = options;

  const ComponentWithResize = (props: P) => {
    const ref = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState<Size>({ width: null, height: null });

    useEffect(() => {
      const element = ref.current;
      if (!element) return;

      const handleResize = (newSize: Size) => {
        const { width, height } = newSize;
        setSize((prevSize) => ({
          width: monitorWidth ? width : prevSize.width,
          height: monitorHeight ? height : prevSize.height,
        }));
      };

      const stopListening = resizeDetector(element, handleResize);

      return () => {
        if (stopListening) {
          stopListening();
        }
        // handleResize.cancel();
      };
    }, [monitorWidth, monitorHeight, refreshRate]);

    const hasSize = size.width !== null && size.height !== null;
    const shouldRenderPlaceholder = !noPlaceholder && !hasSize;

    return (
      <div ref={ref} style={{ width: "100%", height: "100%" }}>
        {shouldRenderPlaceholder ? (
          <div style={{ width: "100%", height: "100%" }} />
        ) : (
          <WrappedComponent size={size} {...props} />
        )}
      </div>
    );
  };
  return ComponentWithResize;
};

export default withResize;
