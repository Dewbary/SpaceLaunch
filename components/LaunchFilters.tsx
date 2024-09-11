import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePickerWithRange } from "./ui/datePickerWithRange";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { DateRange } from "react-day-picker";

type Props = {
  toggleShowPastWeekLaunches: () => void;
  toggleShowLaunchesThisYear: () => void;
  toggleShowUpcomingLaunches: () => void;
  toggleDateRange: () => void;
  onSelectDateRange: (date: DateRange | undefined) => void;
};

const LaunchFilters = ({
  toggleShowPastWeekLaunches,
  toggleShowLaunchesThisYear,
  toggleShowUpcomingLaunches,
  toggleDateRange,
  onSelectDateRange,
}: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Launch Filters</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div>
          <Checkbox onClick={() => toggleShowPastWeekLaunches()} />
          <Label>Past Week</Label>
        </div>
        <div>
          <Checkbox onClick={() => toggleShowLaunchesThisYear()} />
          <Label>This Year</Label>
        </div>
        <div>
          <Checkbox onClick={() => toggleShowUpcomingLaunches()} />
          <Label>Upcoming</Label>
        </div>
        <div className="flex">
          <Checkbox onClick={() => toggleDateRange()} />
          <DatePickerWithRange onClose={onSelectDateRange} />
        </div>
      </CardContent>
    </Card>
  );
};

export default LaunchFilters;
