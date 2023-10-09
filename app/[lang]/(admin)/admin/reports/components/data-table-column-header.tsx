import { Column } from "@tanstack/react-table";
import { ChevronsUpDown, EyeOff, SortAsc, SortDesc } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center gap-2 m-0", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className=" h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <SortDesc className="mx-1 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <SortAsc className="mx-1 h-4 w-4" />
            ) : (
              <ChevronsUpDown className="mx-1 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="">
          <DropdownMenuItem
            className="flex flex-row gap-2 justify-end"
            onClick={() => column.toggleSorting(false)}
          >
            صعودی
            <SortAsc className=" h-3.5 w-3.5 text-muted-foreground/70" />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex gap-2 justify-end"
            onClick={() => column.toggleSorting(true)}
          >
            نزولی
            <SortDesc className=" h-3.5 w-3.5 text-muted-foreground/70" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex gap-2 justify-end"
            onClick={() => column.toggleVisibility(false)}
          >
            <p>مخفی</p>
            <EyeOff className="   h-3.5 w-3.5 text-muted-foreground/70" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
