"use client";
import { useQuery } from "@tanstack/react-query";
import Earth from "../components/earth";
import { ModeToggle } from "@/components/ModeToggle";
import { getClient } from "@/utils/supabase/client";
import React from "react";
import { DateRange } from "react-day-picker";
import { Launch, LaunchGroup } from "@/utils/types";
import { calculateLaunchGroups } from "@/utils/launchUtils";
import LaunchFilters from "@/components/LaunchFilters";
import LaunchDetails from "@/components/LaunchDetails";
import withResize from "@/utils/withResize";

const supabase = getClient();

export default function Home() {
  const [showPastWeekLaunches, setShowPastWeekLaunches] = React.useState(false);
  const [showLaunchesThisYear, setShowLaunchesThisYear] = React.useState(false);
  const [useDateRange, setUseDateRange] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [selectedGroup, setSelectedGroup] = React.useState<LaunchGroup | null>(
    null
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

  const groups = React.useMemo(() => {
    // Grab the launch data object from each launch
    const launchesData = launchData.map(({ launchData }) => launchData);

    // Calculate the launch groups by proximity
    return calculateLaunchGroups(launchesData);
  }, [launchData]);

  const launchGroups = React.useMemo<LaunchGroup[]>(() => {
    // Offset the launches in each group
    // groups.forEach((group) => {
    //   offsetLaunches(group);
    // });

    return groups.map((l) => {
      const firstlaunchInGroup = l[0];
      return {
        id: firstlaunchInGroup.id,
        lat: firstlaunchInGroup.pad.latitude,
        lng: firstlaunchInGroup.pad.longitude,
        label: firstlaunchInGroup.name + " (" + l.length + ")",
        groupSize: l.length,
        info: l.length.toString(),
      };
    });
  }, [groups]);

  const toggleDateRange = () => {
    if (useDateRange) {
      setUseDateRange(false);
    } else {
      setUseDateRange(true);
      setShowLaunchesThisYear(false);
      setShowPastWeekLaunches(false);
    }
  };

  const togglePastWeekLaunches = () =>
    setShowPastWeekLaunches((prevState) => !prevState);

  const toggleThisYearLaunches = () =>
    setShowLaunchesThisYear((prevState) => !prevState);

  const handleSelectGroup = (group: LaunchGroup) => {
    setSelectedGroup(group);
  };

  const greenDivRef = React.useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const updateDimensions = () => {
      if (greenDivRef.current) {
        const { offsetWidth, offsetHeight } = greenDivRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
    };

    // Update dimensions on mount and when the window is resized
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  return (
    <div className="flex flex-1 flex-row bg-red-600 min-h-screen h-screen">
      <div ref={greenDivRef} className="flex-grow bg-green-400 min-w-0 h-full">
        <Earth
          width={dimensions.width}
          height={dimensions.height}
          launchGroups={launchGroups}
          onSelectGroup={handleSelectGroup}
        />
      </div>
      <div className="w-96 bg-slate-500 shrink-0 h-full"></div>
      <div className="absolute bottom-10 left-10 z-10">
        <LaunchFilters
          toggleShowPastWeekLaunches={togglePastWeekLaunches}
          toggleShowLaunchesThisYear={toggleThisYearLaunches}
          toggleShowUpcomingLaunches={() => {}}
          toggleDateRange={toggleDateRange}
          onSelectDateRange={(dateRange) => setDateRange(dateRange)}
        />
      </div>
      {/* <LaunchDetails
          selectedLaunchGroup={selectedGroup}
          launchGroups={groups}
        /> */}
      {/* </div> */}
      <div className="absolute top-10 left-10">
        <ModeToggle />
      </div>
    </div>
  );
}

interface DummyComponentProps {
  greeting: string;
  width: number;
  height: number;
}

const DummyComponent: React.FC<DummyComponentProps> = ({
  greeting,
  width,
  height,
}) => {
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: "lightblue",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid #000",
      }}
    >
      <p>{greeting}</p>
    </div>
  );
};

const ResizableEarth = withResize(DummyComponent, {
  monitorWidth: true,
  monitorHeight: true,
  refreshRate: 12,
  refreshMode: "throttle",
});
