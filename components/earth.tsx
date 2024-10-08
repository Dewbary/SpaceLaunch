"use client";

import React from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { LabelGroup, LaunchData, LaunchGroup } from "@/utils/types";
import { useContainerSize } from "@/hooks/useContainerSize";
import Globe, { GlobeMethods } from "react-globe.gl";

const loader = new GLTFLoader();

const DEFAULT_POINT_OF_VIEW_ALTITUDE = 2;
const RENDER_FACTOR = 0.15;
const TRANSITION_TIME_MS = 500;

type Props = {
  launchGroups: LaunchGroup[];
  labelGroups: LabelGroup[];
  onSelectGroup: (group: LaunchGroup) => void;
};

const Earth = ({ launchGroups, labelGroups, onSelectGroup }: Props) => {
  const globeEl = React.useRef<GlobeMethods | undefined>(undefined);

  const { containerRef, size } = useContainerSize();

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    globeEl?.current?.pointOfView({ altitude: DEFAULT_POINT_OF_VIEW_ALTITUDE });
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    globeEl.current?.pointOfView(
      {
        ...coords,
        altitude: DEFAULT_POINT_OF_VIEW_ALTITUDE,
      },
      TRANSITION_TIME_MS
    );

    onSelectGroup(group as LaunchGroup);
  };

  return (
    <div ref={containerRef} className="flex-1 min-w-0">
      {isMounted && (
        <Globe
          ref={globeEl}
          width={size.width}
          height={size.height + 50}
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          // globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          labelsData={labelGroups}
          labelText={"info"}
          labelSize={1}
          labelDotRadius={0.2}
          labelColor={() => "rgba(255, 165, 0, 0.75)"}
          objectsData={launchGroups}
          objectLabel="label"
          objectAltitude={0.04}
          // @ts-expect-error - generic object type
          objectThreeObject={(group) => getLaunchObject(group)}
          onObjectClick={handleObjectClick}
        />
      )}
    </div>
  );
};

export default Earth;
