import { DateRange } from "react-day-picker";
import { ComboboxDemo } from "./ui/combobox";
import { PopoverDemo } from "./FilterPopover";
import { DatePickerWithRange } from "./ui/datePickerWithRange";
// import LaunchDateRangePicker from "./LaunchDateRangePicker";

type Props = {
  onSelectDateRange: (date: DateRange | undefined) => void;
};

const LaunchFilters = ({ onSelectDateRange }: Props) => {
  return (
    <div className="fixed flex top-16 left-8 z-10 gap-2">
      {/* <ComboboxDemo /> */}
      <PopoverDemo />
      <DatePickerWithRange onClose={onSelectDateRange} />
      {/* <LaunchDateRangePicker
        onSelectDateRange={onSelectDateRange}
        toggleShowLaunchesThisYear={toggleShowLaunchesThisYear}
        toggleShowPastWeekLaunches={toggleShowPastWeekLaunches}
        toggleShowUpcomingLaunches={toggleShowUpcomingLaunches}
      /> */}
    </div>
  );
};

export default LaunchFilters;
