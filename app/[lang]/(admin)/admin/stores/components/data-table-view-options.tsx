"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Table } from "@tanstack/react-table";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="absolute -top-12" asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-[#ff9901] border-0 text-white hover:bg-[#f79400] hover:text-white ml-auto  h-8 lg:flex"
        >
          <SlidersHorizontal className="mx-1 h-4 w-4" />
          ستون ها
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className=" bordercolor w-[150px]">
        {/* <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator /> */}
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize flex "
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
