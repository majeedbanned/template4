"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { create } from "zustand";
import { toast } from "sonner";
import { Loader2, Download, FileText, Filter, ChevronDown, ChevronUp, ArrowUp, ArrowDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";

interface PelakReportData {
  pelak: string;
  name: string;
  totalCharge: number;
  totalPaidAmount: number;
  remainingBalance: number;
}

interface PelakReportModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const usePelakReportModal = create<PelakReportModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

interface ReportFilters {
  pelak?: string;
  name?: string;
  totalChargeMin?: number;
  totalChargeMax?: number;
  totalPaidAmountMin?: number;
  totalPaidAmountMax?: number;
  remainingBalanceMin?: number;
  remainingBalanceMax?: number;
}

type SortField = "pelak" | "name" | "totalCharge" | "totalPaidAmount" | "remainingBalance";
type SortDirection = "asc" | "desc";

export const PelakReportModal = () => {
  const pelakReportModal = usePelakReportModal();
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<ReportFilters>({});
  const [sortField, setSortField] = useState<SortField>("pelak");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const {
    data: reportData,
    isLoading: dataLoading,
    mutate,
  } = useSWR<PelakReportData[]>(
    pelakReportModal.isOpen ? "/api/rob/report" : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    if (pelakReportModal.isOpen) {
      mutate();
      // Reset filters and sort when modal opens
      setFilters({});
      setSortField("pelak");
      setSortDirection("asc");
      setIsFiltersOpen(false);
    }
  }, [pelakReportModal.isOpen, mutate]);

  const formatCurrency = (amount: number | string) => {
    // Ensure amount is a number
    const numAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : Number(amount) || 0;
    return new Intl.NumberFormat("fa-IR", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount);
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    if (!reportData) return [];

    let filtered = [...reportData];

    // Apply filters
    if (filters.pelak) {
      filtered = filtered.filter((item) =>
        item.pelak.toLowerCase().includes(filters.pelak!.toLowerCase())
      );
    }

    if (filters.name) {
      filtered = filtered.filter((item) =>
        (item.name || "").toLowerCase().includes(filters.name!.toLowerCase())
      );
    }

    if (filters.totalChargeMin !== undefined) {
      filtered = filtered.filter(
        (item) => Number(item.totalCharge) >= filters.totalChargeMin!
      );
    }

    if (filters.totalChargeMax !== undefined) {
      filtered = filtered.filter(
        (item) => Number(item.totalCharge) <= filters.totalChargeMax!
      );
    }

    if (filters.totalPaidAmountMin !== undefined) {
      filtered = filtered.filter(
        (item) => Number(item.totalPaidAmount) >= filters.totalPaidAmountMin!
      );
    }

    if (filters.totalPaidAmountMax !== undefined) {
      filtered = filtered.filter(
        (item) => Number(item.totalPaidAmount) <= filters.totalPaidAmountMax!
      );
    }

    if (filters.remainingBalanceMin !== undefined) {
      filtered = filtered.filter(
        (item) => Number(item.remainingBalance) >= filters.remainingBalanceMin!
      );
    }

    if (filters.remainingBalanceMax !== undefined) {
      filtered = filtered.filter(
        (item) => Number(item.remainingBalance) <= filters.remainingBalanceMax!
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "pelak":
          aValue = a.pelak.toLowerCase();
          bValue = b.pelak.toLowerCase();
          break;
        case "name":
          aValue = (a.name || "").toLowerCase();
          bValue = (b.name || "").toLowerCase();
          break;
        case "totalCharge":
          aValue = Number(a.totalCharge);
          bValue = Number(b.totalCharge);
          break;
        case "totalPaidAmount":
          aValue = Number(a.totalPaidAmount);
          bValue = Number(b.totalPaidAmount);
          break;
        case "remainingBalance":
          aValue = Number(a.remainingBalance);
          bValue = Number(b.remainingBalance);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [reportData, filters, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleResetFilters = () => {
    setFilters({});
    toast.success("فیلترها پاک شدند");
  };

  const updateFilter = (key: keyof ReportFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" || value === undefined ? undefined : value,
    }));
  };

  const parseNumberInput = (value: string): number | undefined => {
    const cleaned = value.replace(/,/g, "").trim();
    if (!cleaned) return undefined;
    const num = parseFloat(cleaned);
    return isNaN(num) ? undefined : num;
  };

  const handleExport = () => {
    if (!filteredAndSortedData || filteredAndSortedData.length === 0) {
      toast.error("داده‌ای برای خروجی وجود ندارد");
      return;
    }

    // Create CSV content
    const headers = ["پلاک", "نام", "جمع کل", "مجموع پرداخت‌ها", "مانده قابل پرداخت"];
    const rows = filteredAndSortedData.map((item) => [
      item.pelak,
      item.name || "",
      formatCurrency(item.totalCharge),
      formatCurrency(item.totalPaidAmount),
      formatCurrency(item.remainingBalance),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create blob and download
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `گزارش_پلاک_ها_${new Date().toLocaleDateString("fa-IR").replace(/\//g, "_")}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("فایل با موفقیت دانلود شد");
  };

  // Calculate totals - ensure all values are numbers (based on filtered data)
  const totals = filteredAndSortedData
    ? filteredAndSortedData.reduce(
        (acc, item) => ({
          totalCharge: acc.totalCharge + Number(item.totalCharge || 0),
          totalPaidAmount: acc.totalPaidAmount + Number(item.totalPaidAmount || 0),
          remainingBalance: acc.remainingBalance + Number(item.remainingBalance || 0),
        }),
        { totalCharge: 0, totalPaidAmount: 0, remainingBalance: 0 }
      )
    : { totalCharge: 0, totalPaidAmount: 0, remainingBalance: 0 };

  return (
    <Dialog open={pelakReportModal.isOpen} onOpenChange={pelakReportModal.onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            گزارش جامع پلاک‌ها
          </DialogTitle>
          <DialogDescription className="text-center">
            گزارش جمع کل، مجموع پرداخت‌ها و مانده قابل پرداخت برای تمام پلاک‌ها
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {dataLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="mt-4 text-sm text-gray-500">در حال بارگذاری...</p>
            </div>
          ) : reportData && reportData.length > 0 ? (
            <>
              {/* Filters and Actions */}
              <div className="mb-4 space-y-3">
                <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                  <div className="flex items-center justify-between">
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Filter className="h-4 w-4" />
                        فیلترها
                        {isFiltersOpen ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <div className="flex gap-2">
                      {Object.keys(filters).length > 0 && (
                        <Button
                          onClick={handleResetFilters}
                          variant="outline"
                          size="sm"
                        >
                          پاک کردن فیلترها
                        </Button>
                      )}
                      <Button
                        onClick={handleExport}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        خروجی CSV
                      </Button>
                    </div>
                  </div>
                  <CollapsibleContent className="mt-3">
                    <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Pelak Filter */}
                        <div className="space-y-2">
                          <Label htmlFor="filter-pelak">پلاک</Label>
                          <Input
                            id="filter-pelak"
                            placeholder="جستجو در پلاک"
                            value={filters.pelak || ""}
                            onChange={(e) => updateFilter("pelak", e.target.value)}
                          />
                        </div>
                        {/* Name Filter */}
                        <div className="space-y-2">
                          <Label htmlFor="filter-name">نام</Label>
                          <Input
                            id="filter-name"
                            placeholder="جستجو در نام"
                            value={filters.name || ""}
                            onChange={(e) => updateFilter("name", e.target.value)}
                          />
                        </div>
                        {/* Total Charge Range */}
                        <div className="space-y-2">
                          <Label>جمع کل (حداقل)</Label>
                          <Input
                            placeholder="حداقل جمع کل"
                            value={filters.totalChargeMin?.toLocaleString("fa-IR") || ""}
                            onChange={(e) =>
                              updateFilter("totalChargeMin", parseNumberInput(e.target.value))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>جمع کل (حداکثر)</Label>
                          <Input
                            placeholder="حداکثر جمع کل"
                            value={filters.totalChargeMax?.toLocaleString("fa-IR") || ""}
                            onChange={(e) =>
                              updateFilter("totalChargeMax", parseNumberInput(e.target.value))
                            }
                          />
                        </div>
                        {/* Total Paid Amount Range */}
                        <div className="space-y-2">
                          <Label>مجموع پرداخت‌ها (حداقل)</Label>
                          <Input
                            placeholder="حداقل مجموع پرداخت‌ها"
                            value={filters.totalPaidAmountMin?.toLocaleString("fa-IR") || ""}
                            onChange={(e) =>
                              updateFilter("totalPaidAmountMin", parseNumberInput(e.target.value))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>مجموع پرداخت‌ها (حداکثر)</Label>
                          <Input
                            placeholder="حداکثر مجموع پرداخت‌ها"
                            value={filters.totalPaidAmountMax?.toLocaleString("fa-IR") || ""}
                            onChange={(e) =>
                              updateFilter("totalPaidAmountMax", parseNumberInput(e.target.value))
                            }
                          />
                        </div>
                        {/* Remaining Balance Range */}
                        <div className="space-y-2">
                          <Label>مانده قابل پرداخت (حداقل)</Label>
                          <Input
                            placeholder="حداقل مانده قابل پرداخت"
                            value={filters.remainingBalanceMin?.toLocaleString("fa-IR") || ""}
                            onChange={(e) =>
                              updateFilter("remainingBalanceMin", parseNumberInput(e.target.value))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>مانده قابل پرداخت (حداکثر)</Label>
                          <Input
                            placeholder="حداکثر مانده قابل پرداخت"
                            value={filters.remainingBalanceMax?.toLocaleString("fa-IR") || ""}
                            onChange={(e) =>
                              updateFilter("remainingBalanceMax", parseNumberInput(e.target.value))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Sort Options */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm">مرتب‌سازی بر اساس:</Label>
                  <Select
                    value={sortField}
                    onValueChange={(value) => setSortField(value as SortField)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pelak">پلاک</SelectItem>
                      <SelectItem value="name">نام</SelectItem>
                      <SelectItem value="totalCharge">جمع کل</SelectItem>
                      <SelectItem value="totalPaidAmount">مجموع پرداخت‌ها</SelectItem>
                      <SelectItem value="remainingBalance">مانده قابل پرداخت</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                    }
                    className="flex items-center gap-1"
                  >
                    {sortDirection === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                    {sortDirection === "asc" ? "صعودی" : "نزولی"}
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="text-center font-bold">ردیف</TableHead>
                      <TableHead className="text-center font-bold">
                        <button
                          onClick={() => handleSort("pelak")}
                          className="flex items-center gap-1 hover:text-blue-600"
                        >
                          پلاک
                          {sortField === "pelak" &&
                            (sortDirection === "asc" ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            ))}
                        </button>
                      </TableHead>
                      <TableHead className="text-center font-bold">
                        <button
                          onClick={() => handleSort("name")}
                          className="flex items-center gap-1 hover:text-blue-600"
                        >
                          نام
                          {sortField === "name" &&
                            (sortDirection === "asc" ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            ))}
                        </button>
                      </TableHead>
                      <TableHead className="text-center font-bold text-green-700">
                        <button
                          onClick={() => handleSort("totalCharge")}
                          className="flex items-center gap-1 hover:text-green-800"
                        >
                          جمع کل
                          {sortField === "totalCharge" &&
                            (sortDirection === "asc" ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            ))}
                        </button>
                      </TableHead>
                      <TableHead className="text-center font-bold text-blue-700">
                        <button
                          onClick={() => handleSort("totalPaidAmount")}
                          className="flex items-center gap-1 hover:text-blue-800"
                        >
                          مجموع پرداخت‌ها
                          {sortField === "totalPaidAmount" &&
                            (sortDirection === "asc" ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            ))}
                        </button>
                      </TableHead>
                      <TableHead className="text-center font-bold text-red-700">
                        <button
                          onClick={() => handleSort("remainingBalance")}
                          className="flex items-center gap-1 hover:text-red-800"
                        >
                          مانده قابل پرداخت
                          {sortField === "remainingBalance" &&
                            (sortDirection === "asc" ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            ))}
                        </button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedData.length > 0 ? (
                      filteredAndSortedData.map((item, index) => (
                      <TableRow key={item.pelak}>
                        <TableCell className="text-center">
                          {(index + 1).toLocaleString("fa-IR")}
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {item.pelak}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.name || "-"}
                        </TableCell>
                        <TableCell className="text-center text-green-700 font-semibold">
                          {formatCurrency(item.totalCharge)} ریال
                        </TableCell>
                        <TableCell className="text-center text-blue-700 font-semibold">
                          {formatCurrency(item.totalPaidAmount)} ریال
                        </TableCell>
                        <TableCell
                          className={`text-center font-semibold ${
                            item.remainingBalance > 0
                              ? "text-red-700"
                              : item.remainingBalance < 0
                              ? "text-green-700"
                              : "text-gray-700"
                          }`}
                        >
                          {formatCurrency(item.remainingBalance)} ریال
                        </TableCell>
                      </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          هیچ داده‌ای با فیلترهای اعمال شده یافت نشد
                        </TableCell>
                      </TableRow>
                    )}
                    {/* Totals row */}
                    {filteredAndSortedData.length > 0 && (
                    <TableRow className="bg-gray-50 font-bold">
                      <TableCell
                        colSpan={3}
                        className="text-center font-bold"
                      >
                        جمع کل
                      </TableCell>
                      <TableCell className="text-center text-green-700 font-bold">
                        {formatCurrency(totals.totalCharge)} ریال
                      </TableCell>
                      <TableCell className="text-center text-blue-700 font-bold">
                        {formatCurrency(totals.totalPaidAmount)} ریال
                      </TableCell>
                      <TableCell
                        className={`text-center font-bold ${
                          totals.remainingBalance > 0
                            ? "text-red-700"
                            : totals.remainingBalance < 0
                            ? "text-green-700"
                            : "text-gray-700"
                        }`}
                      >
                        {formatCurrency(totals.remainingBalance)} ریال
                      </TableCell>
                    </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                <p>
                  تعداد کل پلاک‌ها:{" "}
                  <span className="font-bold">
                    {reportData.length.toLocaleString("fa-IR")}
                  </span>
                </p>
                {Object.keys(filters).length > 0 && (
                  <p>
                    تعداد نتایج فیلتر شده:{" "}
                    <span className="font-bold">
                      {filteredAndSortedData.length.toLocaleString("fa-IR")}
                    </span>
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-500">داده‌ای یافت نشد</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default usePelakReportModal;

