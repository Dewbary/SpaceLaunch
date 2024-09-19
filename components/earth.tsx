"use client";

import Globe, { GlobeMethods } from "react-globe.gl";
import React from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { LaunchData, LaunchGroup } from "@/utils/types";
import { SizeMe } from "react-sizeme";
import withResize from "@/utils/withResize";

const loader = new GLTFLoader();

const DEFAULT_POINT_OF_VIEW_ALTITUDE = 1.8;
const RENDER_FACTOR = 0.15;
const TRANSITION_TIME_MS = 500;

type Props = {
  width: number | null;
  height: number | null;
  launchGroups: LaunchGroup[];
  onSelectGroup: (group: LaunchGroup) => void;
};

const Earth = ({ width, height, launchGroups, onSelectGroup }: Props) => {
  const globeEl = React.useRef<GlobeMethods | undefined>(undefined);

  React.useEffect(() => {
    globeEl?.current?.pointOfView({ altitude: DEFAULT_POINT_OF_VIEW_ALTITUDE });
  }, []);

  const getLaunchObject = (launchGroup: LaunchData[]) => {
    const group = new THREE.Group();

    loader.load("starship/scene.gltf", function (gltf) {
      group.add(gltf.scene);
    });

    group.scale.set(RENDER_FACTOR, RENDER_FACTOR, RENDER_FACTOR);
    group.rotateX(Math.PI / 2);

    return group;
  };

  const handleObjectClick = (
    group: object,
    event: MouseEvent,
    coords: {
      lat: number;
      lng: number;
      altitude: number;
    }
  ) => {
    // focus on the selected group
    globeEl.current?.pointOfView(
      {
        ...coords,
        altitude: DEFAULT_POINT_OF_VIEW_ALTITUDE,
      },
      TRANSITION_TIME_MS
    );

    onSelectGroup(group as LaunchGroup);
  };

  // const testRef = React.useRef<HTMLDivElement | null>(null);
  // const [width, setWidth] = React.useState<number>(0);
  // const [height, setHeight] = React.useState<number>(0);

  // // Function to update the width and height based on the container
  // const updateDimensions = React.useCallback(() => {
  //   if (testRef.current) {
  //     setWidth(testRef.current.offsetWidth);
  //     setHeight(testRef.current.offsetHeight);
  //   }
  // }, []);

  // Set the dimensions on mount and window resize
  // React.useEffect(() => {
  //   updateDimensions(); // Set the initial dimensions
  //   window.addEventListener("resize", updateDimensions); // Listen for resize events
  //   return () => window.removeEventListener("resize", updateDimensions); // Cleanup on unmount
  // }, [updateDimensions]);

  // const { width, height } = size;

  // console.log(width, height);

  return (
    <>
      {width && height && (
        <Globe
          ref={globeEl}
          width={width}
          height={height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          labelsData={launchGroups}
          labelText={"info"}
          labelSize={1}
          labelDotRadius={0.2}
          labelColor={() => "rgba(255, 165, 0, 0.75)"}
          objectsData={launchGroups}
          objectLabel="label"
          objectAltitude={0.04}
          objectThreeObject={(group) => getLaunchObject(group as any)}
          onObjectClick={handleObjectClick}
        />
      )}
    </>
  );
};

// const ResizableEarth = withResize(Earth, {
//   monitorWidth: true,
//   monitorHeight: true,
//   refreshRate: 12,
//   refreshMode: "throttle",
// });

export default Earth;
