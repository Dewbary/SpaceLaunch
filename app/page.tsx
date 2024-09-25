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
import { Menu } from "@/components/ui/menu";

const supabase = getClient();

export default function Home() {
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
    enabled: true,
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
    enabled: true,
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
    enabled: true,
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
    enabled: true,
  });

  const launchData = React.useMemo<Launch[]>(() => {
    let launches: Launch[] = [];

    if (dateRangeLaunches) {
      return dateRangeLaunches;
    }

    if (pastWeekLaunches) {
      launches = [...pastWeekLaunches];
    }

    if (thisYearLaunches) {
      launches = [...launches, ...thisYearLaunches];
    }

    if (data) {
      launches = [...data];
    }

    return launches;
  }, [data, dateRangeLaunches, pastWeekLaunches, thisYearLaunches]);

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

  const handleSelectGroup = (group: LaunchGroup) => {
    setSelectedGroup(group);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex h-full">
        <Menu />
        <LaunchFilters
          onSelectDateRange={(dateRange) => setDateRange(dateRange)}
        />

        <Earth launchGroups={launchGroups} onSelectGroup={handleSelectGroup} />
        <LaunchDetails
          selectedLaunchGroup={selectedGroup}
          launchGroups={groups}
        />
        <div className="fixed bottom-12 left-8">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
