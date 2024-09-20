"use client";

import Globe, { GlobeMethods } from "react-globe.gl";
import React from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { LaunchData, LaunchGroup } from "@/utils/types";
import { useContainerSize } from "@/hooks/useContainerSize";

const loader = new GLTFLoader();

const DEFAULT_POINT_OF_VIEW_ALTITUDE = 1.8;
const RENDER_FACTOR = 0.15;
const TRANSITION_TIME_MS = 500;

type Props = {
  launchGroups: LaunchGroup[];
  onSelectGroup: (group: LaunchGroup) => void;
};

const Earth = ({ launchGroups, onSelectGroup }: Props) => {
  const globeEl = React.useRef<GlobeMethods | undefined>(undefined);

  const { containerRef, size } = useContainerSize();

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
    globeEl.current?.pointOfView(
      {
        ...coords,
        altitude: DEFAULT_POINT_OF_VIEW_ALTITUDE,
      },
      TRANSITION_TIME_MS
    );

    onSelectGroup(group as LaunchGroup);
  };

  if (!window) return null;
  return (
    <div ref={containerRef} className="flex-1 min-w-0">
      <Globe
        ref={globeEl}
        width={size.width}
        height={size.height}
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        // globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        labelsData={launchGroups}
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
    </div>
  );
};

export default Earth;
