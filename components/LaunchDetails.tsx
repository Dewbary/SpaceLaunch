import type { LaunchData, LaunchGroup } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";

type Props = {
  selectedLaunchGroup: LaunchGroup | null;
  launchGroups: LaunchData[][];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const LaunchDetails = ({
  selectedLaunchGroup,
  launchGroups,
  isOpen,
  onOpenChange,
}: Props) => {
  const launchGroup = launchGroups.find(
    (group) => group?.[0]?.id === selectedLaunchGroup?.id
  );

  if (!launchGroup) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="bg-black bg-opacity-75">
        <SheetHeader>
          <SheetTitle>Launch Details</SheetTitle>
          <SheetDescription>
            View info about launches in this area
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4 overflow-auto h-full">
          {launchGroup?.map((launch) => {
            const launchInfoUrl = launch.infoURLs?.[0]?.url ?? "";
            return (
              <div key={launch.id}>
                <Link href={launchInfoUrl}>
                  <Image
                    className="w-full h-64"
                    src={launch.image ?? "rocket.svg"}
                    width={500}
                    height={500}
                    alt="Picture of the author"
                  />
                </Link>
                <h2>{launch.name}</h2>
                <div>{launch.launch_service_provider.name}</div>
                <div>{launch.launch_service_provider.type}</div>
              </div>
            );
          })}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default LaunchDetails;
