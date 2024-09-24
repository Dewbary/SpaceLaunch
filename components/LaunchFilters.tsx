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
    <>
      <DatePickerWithRange onClose={onSelectDateRange} />
      <div className="flex gap-x-2 items-center">
        <Checkbox onClick={toggleShowPastWeekLaunches} />
        <Label>Past Week</Label>
      </div>
      <div className="flex gap-x-2 items-center">
        <Checkbox onClick={toggleShowLaunchesThisYear} />
        <Label>This Year</Label>
      </div>
      <div className="flex gap-x-2 items-center">
        <Checkbox onClick={toggleShowUpcomingLaunches} />
        <Label>Upcoming</Label>
      </div>
    </>
  );
};

export default LaunchFilters;
