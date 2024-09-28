"use client";
import { useQuery } from "@tanstack/react-query";
import { ModeToggle } from "@/components/ModeToggle";
import { getClient } from "@/utils/supabase/client";
import React from "react";
import { DateRange } from "react-day-picker";
import { LabelGroup, Launch, LaunchGroup } from "@/utils/types";
import { calculateLaunchGroups } from "@/utils/launchUtils";
import LaunchFilters from "@/components/LaunchFilters";
import LaunchDetails from "@/components/LaunchDetails";
import { Menu } from "@/components/ui/menu";
import { startOfToday, endOfWeek } from "date-fns";
import dynamic from "next/dynamic";

const Earth = dynamic(() => import("../components/earth"), {
  ssr: false,
});

const supabase = getClient();

export default function Home() {
  const today = startOfToday();
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: today,
    to: endOfWeek(today),
  });
  const [selectedGroup, setSelectedGroup] = React.useState<LaunchGroup | null>(
    null
  );

  const { data } = useQuery({
    queryKey: ["launchData", dateRange],
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

    if (data) {
      launches = [...data];
    }

    return launches;
  }, [data]);

  const groups = React.useMemo(() => {
    // Grab the launch data object from each launch
    const launchesData = launchData.map(({ launchData }) => launchData);

    // Calculate the launch groups by proximity
    return calculateLaunchGroups(launchesData);
  }, [launchData]);

  const labelGroups = React.useMemo<LabelGroup[]>(() => {
    return groups.map((l) => {
      const firstlaunchInGroup = l[0];
      return {
        lat: firstlaunchInGroup.pad.latitude,
        lng: firstlaunchInGroup.pad.longitude,
        info: l.length.toString(),
      };
    });
  }, [groups]);

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
        <Earth
          launchGroups={launchGroups}
          labelGroups={labelGroups}
          onSelectGroup={handleSelectGroup}
        />
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
