import * as React from "react";
import { Column } from "@tanstack/react-table";
import { Check, LucideIcon, PlusCircle } from "lucide-react";
import useSWR from "swr";

import { cn, fetcher } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { string } from "zod";
import { FilterOptions } from "@/lib/types";
import { data } from "autoprefixer";

interface FacetedFilter<TData, TValue> {
  //  column?: Column<TData, TValue>;
  title?: string;
  selected?: number[] | undefined;
  filterOption?: string;
  onChange: ([]) => void;
  options: {
    label: string;
    value: string;
    icon?: LucideIcon;
  }[];
}

export function FacetedFilter<TData, TValue>({
  //column,
  selected,
  title,
  options,
  filterOption,
  onChange,
}: FacetedFilter<TData, TValue>) {
  //const facets = column?.getFacetedUniqueValues();
  //const selectedValues = ['ali','hasan'];
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

  const removeValue = (value: string) => {
    var array = [...selectedValues]; // make a separate copy of the array
    var index = array.indexOf(value);
    if (index !== -1) {
      array.splice(index, 1);
      setSelectedValues(array);
    }
  };

  React.useEffect(() => {
    onChange(selectedValues); // This will always use latest value of count
  }, [selectedValues, onChange]);

  const { data, isLoading, mutate } = useSWR<FilterOptions[]>(
    `/api/filters?filter=${filterOption}`,
    fetcher
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.length}
              </Badge>
              <div className="hidden gap-1 lg:flex">
                {selectedValues.length > 3 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.length} selected
                  </Badge>
                ) : (
                  data
                    ?.filter((option) => selectedValues.includes(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}

          {/* {selected && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selected?.length}
              </Badge>
              <div className="hidden gap-1 lg:flex">
                {selected && selected?.length > 3 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selected?.length} selected
                  </Badge>
                ) : (
                  data
                    ?.filter((option) =>
                      selected?.includes(Number(option.value))
                    )
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )} */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {data?.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        //selectedValues.delete(option.value);
                        removeValue(option.value);
                      } else {
                        //  selectedValues.add(option.value);
                        setSelectedValues([...selectedValues, option.value]);

                        //onChange(selectedValues);
                      }
                      // const filterValues = Array.from(selectedValues);
                      // column?.setFilterValue(
                      //   filterValues.length ? filterValues : undefined
                      // );
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {/* {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )} */}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => setSelectedValues([])}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
