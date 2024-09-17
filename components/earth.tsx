"use client";

import Globe, { GlobeMethods } from "react-globe.gl";
import React from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { LaunchData, LaunchGroup } from "@/utils/types";

const loader = new GLTFLoader();

const DEFAULT_POINT_OF_VIEW_ALTITUDE = 1.8;
const RENDER_FACTOR = 0.15;

type Props = {
  launchGroups: LaunchGroup[];
};

const Earth = ({ launchGroups }: Props) => {
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

  return (
    <div className="flex flex-1">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        labelsData={launchGroups}
        labelText={"info"}
        labelSize={1}
        labelDotRadius={0.2}
        labelColor={() => "rgba(255, 165, 0, 0.75)"}
        objectsData={launchGroups}
        objectLabel="label"
        objectAltitude={0.04}
        objectThreeObject={(group) => getLaunchObject(group as any)}
      />
    </div>
  );
};

export default Earth;
