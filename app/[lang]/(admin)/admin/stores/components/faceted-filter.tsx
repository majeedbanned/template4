import * as React from "react";
import { Check, Filter, LucideIcon, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
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

interface FacetedFilter<TData, TValue> {
  title?: string;
  selected?: number[] | undefined;
  filterOption?: string;
  onChange: ([]) => void;
  options?: {
    label: string;
    value: string;
    icon?: LucideIcon;
  }[];
}

export function FacetedFilter<TData, TValue>({
  selected,
  title,
  options,
  filterOption,
  onChange,
}: FacetedFilter<TData, TValue>) {
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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Filter className="text-secondaryText mx-1.5 h-4 w-4" />
          <span className="text-secondaryText">{title}</span>
          {selectedValues?.length > 0 && (
            <>
              <Separator
                orientation="vertical"
                className="bordercolor mx-2 h-4"
              />
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
                    {selectedValues.length} انتخاب شد
                  </Badge>
                ) : (
                  options
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
      <PopoverContent className="bordercolor w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} className="bordercolor" />
          <CommandList>
            <CommandEmpty>یافت نشد.</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        removeValue(option.value);
                      } else {
                        setSelectedValues([...selectedValues, option.value]);
                      }
                    }}
                  >
                    <div
                      className={cn(
                        "mx-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
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
                <CommandSeparator className="bordercolor" />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => setSelectedValues([])}
                    className="justify-center text-center"
                  >
                    حذف فیلتر
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
