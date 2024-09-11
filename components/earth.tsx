"use client";

import { useQuery } from "@tanstack/react-query";
import Globe from "react-globe.gl";
import * as sampleLaunchData from "@/testdata/launchData.json";
import { createClient } from "@/utils/supabase/client";
import LaunchFilters from "./LaunchFilters";
import React from "react";
import { DateRange } from "react-day-picker";

const Earth = () => {
  const supabase = createClient();
  const [showPastWeekLaunches, setShowPastWeekLaunches] = React.useState(false);
  const [showLaunchesThisYear, setShowLaunchesThisYear] = React.useState(false);
  const [useDateRange, setUseDateRange] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  const { isPending, data } = useQuery({
    queryKey: ["launchData"],
    queryFn: async () => {
      // const result = await fetch(
      //   "https://ll.thespacedevs.com/2.2.0/launch/?limit=10&ordering=-net&net__lt=2024-09-06"
      // );
      // return await result.json();

      const { data: launch } = await supabase
        .from("launch")
        .select("*")
        .limit(200);
      return launch;

      // return sampleLaunchData;
    },
    enabled: !showPastWeekLaunches && !showLaunchesThisYear,
  });

  const { data: pastWeekLaunches } = useQuery({
    queryKey: ["weekData"],
    queryFn: async () => {
      const { data: launch, error } = await supabase
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
      const { data: launch, error } = await supabase
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

  const getData = () => {
    let launches: any[] = [];

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
  };

  const handleToggleDateRange = () => {
    if (useDateRange) {
      setUseDateRange(false);
    } else {
      setUseDateRange(true);
      setShowLaunchesThisYear(false);
      setShowPastWeekLaunches(false);
    }
  };

  const gData = getData()?.map(({ id, net, launchData }: any) => ({
    lat: launchData.pad.latitude,
    lng: launchData.pad.longitude,
    size: 1,
    color: "white",
  }));

  // const objectsData = useMemo(() => {
  //   if (!satData) return [];

  //   // Update satellite positions
  //   const gmst = satellite.gstime(time);
  //   return satData.map((d) => {
  //     const eci = satellite.propagate(d.satrec, time);
  //     if (eci.position) {
  //       const gdPos = satellite.eciToGeodetic(eci.position, gmst);
  //       const lat = satellite.radiansToDegrees(gdPos.latitude);
  //       const lng = satellite.radiansToDegrees(gdPos.longitude);
  //       const alt = gdPos.height / EARTH_RADIUS_KM;
  //       return { ...d, lat, lng, alt };
  //     }
  //     return d;
  //   });
  // }, [satData, time]);

  return (
    <div className="flex flex-1">
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        pointsData={gData}
        objectsData={}
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

// {
//   (data.results as any[]).map((launch, index) => (
//     <div className="p-8" key={index}>
//       <div>{launch.name}</div>
//       <div>
//         {launch.pad.name}: {JSON.stringify(launch.pad.latitude)}-
//         {JSON.stringify(launch.pad.longitude)}
//       </div>
//       <div>{launch.net}</div>
//       {/* {JSON.stringify(launch)} */}
//     </div>
//   ));
// }
