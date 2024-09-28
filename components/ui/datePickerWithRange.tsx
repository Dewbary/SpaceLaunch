"use client";

import * as React from "react";
import {
  addDays,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  format,
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  onClose: (date: DateRange | undefined) => void;
};

export function DatePickerWithRange({
  className,
  onClose,
}: React.HTMLAttributes<HTMLDivElement> & Props) {
  const [date, setDate] = React.useState<DateRange | undefined>();

  const setThisWeek = () => {
    const now = new Date();
    setDate({
      from: startOfWeek(now),
      to: endOfWeek(now),
    });
  };

  const setThisYear = () => {
    const now = new Date();
    setDate({
      from: startOfYear(now),
      to: endOfYear(now),
    });
  };

  const setUpcoming = () => {
    const now = new Date();
    setDate({
      from: now,
      to: addDays(now, 30),
    });
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover
        onOpenChange={(open) => {
          if (open) return;
          onClose(date);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            <div className="w-36 border-r border-border/50 p-2 space-y-2 bg-muted/50">
              <div className="px-3 py-2">
                <h3 className="font-medium text-xs text-muted-foreground tracking-wider uppercase">
                  Quick Select
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-left font-normal"
                onClick={setThisWeek}
              >
                This Week
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-left font-normal"
                onClick={setThisYear}
              >
                This Year
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-left font-normal"
                onClick={setUpcoming}
              >
                Upcoming
              </Button>
            </div>
            <div>
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                className="rounded-l-none"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
