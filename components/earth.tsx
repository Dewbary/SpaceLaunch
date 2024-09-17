"use client";

import { useQuery } from "@tanstack/react-query";
import Globe, { GlobeMethods } from "react-globe.gl";
import { getClient } from "@/utils/supabase/client";
import LaunchFilters from "./LaunchFilters";
import React from "react";
import { DateRange } from "react-day-picker";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Launch, LaunchData, LaunchGroup } from "@/utils/types";
import { calculateLaunchGroups } from "@/utils/launchUtils";

const supabase = getClient();
const loader = new GLTFLoader();

const DEFAULT_POINT_OF_VIEW_ALTITUDE = 1.8;
const RENDER_FACTOR = 0.15;

const Earth = () => {
  const globeEl = React.useRef<GlobeMethods | undefined>(undefined);
  const [showPastWeekLaunches, setShowPastWeekLaunches] = React.useState(false);
  const [showLaunchesThisYear, setShowLaunchesThisYear] = React.useState(false);
  const [useDateRange, setUseDateRange] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [globeRadius, setGlobeRadius] = React.useState<number | undefined>(
    undefined
  );

  const { data } = useQuery({
    queryKey: ["launchData"],
    queryFn: async () => {
      const { data: launch } = await supabase
        .from("launch")
        .select("*")
        .limit(200);
      return launch;
    },
    enabled: !showPastWeekLaunches && !showLaunchesThisYear,
  });

  const { data: pastWeekLaunches } = useQuery({
    queryKey: ["weekData"],
    queryFn: async () => {
      const { data: launch } = await supabase
        .from("launch")
        .select("*")
        .lte("net", "2024-09-10")
        .gte("net", "2024-09-03");
      return launch;
    },
    enabled: showPastWeekLaunches,
  });

  const { data: thisYearLaunches } = useQuery({
    queryKey: ["yearData"],
    queryFn: async () => {
      const { data: launch } = await supabase
        .from("launch")
        .select("*")
        .lte("net", "2024-09-10")
        .gte("net", "2024-01-01");
      return launch;
    },
    enabled: showLaunchesThisYear,
  });

  const { data: dateRangeLaunches } = useQuery({
    queryKey: ["dateRangeData"],
    queryFn: async () => {
      const { data: launch } = await supabase
        .from("launch")
        .select("*")
        .lte("net", dateRange?.to?.toISOString())
        .gte("net", dateRange?.from?.toISOString());
      return launch;
    },
    enabled: useDateRange,
  });

  React.useEffect(() => {
    setGlobeRadius(globeEl?.current?.getGlobeRadius());
    globeEl?.current?.pointOfView({ altitude: DEFAULT_POINT_OF_VIEW_ALTITUDE });
  }, []);

  const launchData = React.useMemo<Launch[]>(() => {
    let launches: Launch[] = [];

    if (useDateRange && dateRangeLaunches) {
      return dateRangeLaunches;
    }

    if (showPastWeekLaunches && pastWeekLaunches) {
      launches = [...pastWeekLaunches];
    }

    if (showLaunchesThisYear && thisYearLaunches) {
      launches = [...launches, ...thisYearLaunches];
    }

    if (!showPastWeekLaunches && !showLaunchesThisYear && data) {
      launches = [...data];
    }

    return launches;
  }, [
    useDateRange,
    dateRangeLaunches,
    showPastWeekLaunches,
    pastWeekLaunches,
    showLaunchesThisYear,
    thisYearLaunches,
    data,
  ]);

  const launchGroups = React.useMemo<LaunchGroup[]>(() => {
    // Grab the launch data object from each launch
    const launchesData = launchData.map(({ launchData }) => launchData);

    // Calculate the launch groups by proximity
    const groups = calculateLaunchGroups(launchesData);

    // Offset the launches in each group
    // groups.forEach((group) => {
    //   offsetLaunches(group);
    // });

    return groups.map((l) => {
      const firstlaunchInGroup = l[0];
      return {
        lat: firstlaunchInGroup.pad.latitude,
        lng: firstlaunchInGroup.pad.longitude,
        label: firstlaunchInGroup.name + " (" + l.length + ")",
        groupSize: l.length,
        info: l.length.toString(),
      };
    });
  }, [launchData]);

  const handleToggleDateRange = () => {
    if (useDateRange) {
      setUseDateRange(false);
    } else {
      setUseDateRange(true);
      setShowLaunchesThisYear(false);
      setShowPastWeekLaunches(false);
    }
  };

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
      <div className="absolute top-96 left-20">
        <LaunchFilters
          toggleShowPastWeekLaunches={() =>
            setShowPastWeekLaunches((prevState) => !prevState)
          }
          toggleShowLaunchesThisYear={() =>
            setShowLaunchesThisYear((prevState) => !prevState)
          }
          toggleShowUpcomingLaunches={() => {}}
          toggleDateRange={handleToggleDateRange}
          onSelectDateRange={(dateRange) => setDateRange(dateRange)}
        />
      </div>
    </div>
  );
};

export default Earth;
