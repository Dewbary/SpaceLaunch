import { DateRange } from "react-day-picker";
// import { ComboboxDemo } from "./ui/combobox";
import { DatePickerWithRange } from "./ui/datePickerWithRange";
import { LaunchFiltersPopover } from "./FilterPopover";

type Props = {
  onSelectDateRange: (date: DateRange | undefined) => void;
};

const LaunchFilters = ({ onSelectDateRange }: Props) => {
  return (
    <div className="fixed flex top-16 left-8 z-10 gap-2">
      {/* <ComboboxDemo /> */}
      <LaunchFiltersPopover />
      <DatePickerWithRange onClose={onSelectDateRange} />
    </div>
  );
};

export default LaunchFilters;
