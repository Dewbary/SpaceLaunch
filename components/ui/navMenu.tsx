"use client";

import * as React from "react";
import { Separator } from "./separator";
import { CodeViewer } from "./codeViewer";

export function NavigationMenuDemo() {
  return (
    <div>
      <div className="flex px-16 flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
        <h2 className="text-lg font-semibold">SpaceLaunch</h2>
        <div className="ml-auto flex w-full space-x-2 sm:justify-end">
          <div className="hidden space-x-2 md:flex">
            <CodeViewer />
          </div>
        </div>
      </div>
      <Separator />
    </div>
  );
}
