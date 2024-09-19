import { cn } from "@/lib/utils";
import type { LaunchData, LaunchGroup } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { SidebarToggle } from "./ui/sidebarToggle";
import React from "react";

type Props = {
  selectedLaunchGroup: LaunchGroup | null;
  launchGroups: LaunchData[][];
};

const LaunchDetails = ({ selectedLaunchGroup, launchGroups }: Props) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const launchGroup = launchGroups.find(
    (group) => group?.[0]?.id === selectedLaunchGroup?.id
  );

  // if (!launchGroup) return null;

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen((prevState) => !prevState)}
          className="rounded-md absolute top-10 right-10"
          variant="outline"
        >
          Show Launch Data
        </Button>
      )}
      <aside
        className={cn(
          "w-96"
          // "fixed top-0 right-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
          // isOpen === false ? "w-0" : "w-2/6"

          // "w-96 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300"
          // isOpen === false ? "w-0" : "w-2/6"
        )}
      >
        {isOpen && (
          <SidebarToggle
            isOpen={isOpen}
            setIsOpen={() => setIsOpen((prevState) => !prevState)}
          />
        )}
        <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800">
          {launchGroup?.map((launch) => {
            console.log(launch);

            const launchInfoUrl = launch.infoURLs?.[0]?.url ?? "";

            return (
              <div key={launch.id}>
                <Link href={launchInfoUrl}>
                  <Image
                    src={launch.image}
                    width={500}
                    height={500}
                    alt="Picture of the author"
                  />
                </Link>
                <h2>{launch.name}</h2>
                <div>{launch.launch_service_provider.name}</div>
                <div>{launch.launch_service_provider.type}</div>

                {/* <p>{launch.details}</p> */}
              </div>
            );
          })}
        </div>
      </aside>
    </>

    // <div className="w-96 absolute right-0 top-0 h-full bg-slate-800 overflow-auto">

    // </div>
  );
};

export default LaunchDetails;
