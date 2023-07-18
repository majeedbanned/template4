"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { priorities, statuses } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@heroicons/react/24/outline";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        {table.getSelectedRowModel().flatRows.length > 0 && (
          <Button className="flex gap-2 p-2 h-8" variant={"destructive"}>
            <TrashIcon className="h-4 w-4"></TrashIcon>
            Delete {table.getSelectedRowModel().flatRows.length} selected rows
          </Button>
        )}
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("domdom")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("domdom")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("pass") && (
          <DataTableFacetedFilter
            column={table.getColumn("pass")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("maghtatbl.name") && (
          <DataTableFacetedFilter
            column={table.getColumn("maghtatbl.name")}
            title="maghta"
            options={priorities}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
