import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FilterIcon } from "lucide-react";
import { useState } from "react";

export function LaunchFiltersPopover() {
  const [filters, setFilters] = useState({
    country: "",
    provider: "",
    name: "",
    status: {
      failed: false,
      succeeded: false,
      scrubbed: false,
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // const handleStatusChange = (status: "failed" | "succeeded" | "scrubbed") => {
  //   setFilters((prev) => ({
  //     ...prev,
  //     status: { ...prev.status, [status]: !prev.status[status] },
  //   }));
  // };

  const handleApplyFilters = () => {
    console.log("Applying filters:", filters);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <FilterIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filters</h4>
            <p className="text-sm text-muted-foreground">
              Set the filters for rocket launch data.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="country">Country</Label>
              <Input
                id="width"
                placeholder="e.g. USA"
                value={filters.country}
                onChange={handleInputChange}
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Provider</Label>
              <Input
                id="maxWidth"
                placeholder="e.g. SpaceX"
                value={filters.provider}
                onChange={handleInputChange}
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Name</Label>
              <Input
                id="height"
                placeholder="e.g. Starlink"
                value={filters.name}
                onChange={handleInputChange}
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>Status</Label>
              <Input
                id="maxHeight"
                placeholder="e.g. Success"
                className="col-span-2 h-8"
              />
            </div>
          </div>
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
