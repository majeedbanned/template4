"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { create } from "zustand";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  Download,
  ArrowUpDown,
  X,
  FileSpreadsheet,
} from "lucide-react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

interface StoreReportData {
  id: number;
  pelak: string;
  name: string;
  username: string;
  password: string;
  metraj: number;
  ejareh: number;
  tel1: string;
  tel2: string;
  active: string;
  activeRaw: boolean;
  aghsat: string;
  aghsatRaw: boolean;
  tajmi: string;
  tajmiRaw: boolean;
  malekiyat: string;
  malekiyatRaw: boolean;
  tovzeh: string;
  cposti: string;
  changedate: string;
  Tahvil: string;
  rahro: string;
  rahroId: number;
  bazar: string;
  bazarId: number;
  nov: string;
  novId: number;
  tabagh: string;
  tabaghId: number;
  chargeDefName: string;
  chargeDefCharge: number;
  chargeDefType: string;
  discountPercent: number;
  discountNames: string;
  finalCharge: number;
  tenantName: string;
  tenantType: string;
  tenantEndDate: string;
}

interface StoreReportModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useStoreReportModal = create<StoreReportModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useStoreReportModal;

type SortDirection = "asc" | "desc" | null;

interface FilterState {
  pelak: string;
  name: string;
  rahro: string;
  bazar: string;
  nov: string;
  tabagh: string;
  active: string;
  aghsat: string;
  tajmi: string;
  malekiyat: string;
  chargeDefName: string;
  tenantType: string;
  tel1: string;
  tel2: string;
  ejareh: string;
  metraj: string;
  finalCharge: string;
  discountPercent: string;
  tovzeh: string;
  cposti: string;
  changedate: string;
  Tahvil: string;
  tenantName: string;
  tenantEndDate: string;
  discountNames: string;
  chargeDefCharge: string;
  username: string;
  password: string;
}

const initialFilters: FilterState = {
  pelak: "",
  name: "",
  rahro: "",
  bazar: "",
  nov: "",
  tabagh: "",
  active: "",
  aghsat: "",
  tajmi: "",
  malekiyat: "",
  chargeDefName: "",
  tenantType: "",
  tel1: "",
  tel2: "",
  ejareh: "",
  metraj: "",
  finalCharge: "",
  discountPercent: "",
  tovzeh: "",
  cposti: "",
  changedate: "",
  Tahvil: "",
  tenantName: "",
  tenantEndDate: "",
  discountNames: "",
  chargeDefCharge: "",
  username: "",
  password: "",
};

export const StoreReportModal: React.FC = () => {
  const { isOpen, onClose } = useStoreReportModal();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sortColumn, setSortColumn] = useState<keyof StoreReportData | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const { data, isLoading, error } = useSWR<StoreReportData[]>(
    isOpen ? "/api/store/report" : null,
    fetcher
  );

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) || 0 : Number(amount) || 0;
    return new Intl.NumberFormat("fa-IR", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount);
  };

  // Get unique values for dropdowns
  const uniqueValues = useMemo(() => {
    if (!data) return {};
    return {
      //@ts-ignore
      rahro: [...new Set(data.map((d) => d.rahro).filter(Boolean))],
      //@ts-ignore
      bazar: [...new Set(data.map((d) => d.bazar).filter(Boolean))],
      //@ts-ignore
      nov: [...new Set(data.map((d) => d.nov).filter(Boolean))],
      //@ts-ignore
      tabagh: [...new Set(data.map((d) => d.tabagh).filter(Boolean))],
      //@ts-ignore
      chargeDefName: [...new Set(data.map((d) => d.chargeDefName).filter(Boolean))],
      //@ts-ignore
      tenantType: [...new Set(data.map((d) => d.tenantType).filter(Boolean))],
    };
  }, [data]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    if (!data) return [];

    let result = data.filter((item) => {
      if (filters.pelak && !item.pelak.toLowerCase().includes(filters.pelak.toLowerCase())) return false;
      if (filters.name && !item.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
      if (filters.rahro && item.rahro !== filters.rahro) return false;
      if (filters.bazar && item.bazar !== filters.bazar) return false;
      if (filters.nov && item.nov !== filters.nov) return false;
      if (filters.tabagh && item.tabagh !== filters.tabagh) return false;
      if (filters.active && item.active !== filters.active) return false;
      if (filters.aghsat && item.aghsat !== filters.aghsat) return false;
      if (filters.tajmi && item.tajmi !== filters.tajmi) return false;
      if (filters.malekiyat && item.malekiyat !== filters.malekiyat) return false;
      if (filters.chargeDefName && item.chargeDefName !== filters.chargeDefName) return false;
      if (filters.tenantType && item.tenantType !== filters.tenantType) return false;
      if (filters.tel1 && !String(item.tel1 || "").toLowerCase().includes(filters.tel1.toLowerCase())) return false;
      if (filters.tel2 && !String(item.tel2 || "").toLowerCase().includes(filters.tel2.toLowerCase())) return false;
      if (filters.ejareh && !String(item.ejareh || "").includes(filters.ejareh)) return false;
      if (filters.metraj && !String(item.metraj || "").includes(filters.metraj)) return false;
      if (filters.finalCharge && !String(item.finalCharge || "").includes(filters.finalCharge)) return false;
      if (filters.discountPercent && !String(item.discountPercent || "").includes(filters.discountPercent)) return false;
      if (filters.tovzeh && !String(item.tovzeh || "").toLowerCase().includes(filters.tovzeh.toLowerCase())) return false;
      if (filters.cposti && !String(item.cposti || "").toLowerCase().includes(filters.cposti.toLowerCase())) return false;
      if (filters.changedate && !String(item.changedate || "").includes(filters.changedate)) return false;
      if (filters.Tahvil && !String(item.Tahvil || "").includes(filters.Tahvil)) return false;
      if (filters.tenantName && !String(item.tenantName || "").toLowerCase().includes(filters.tenantName.toLowerCase())) return false;
      if (filters.tenantEndDate && !String(item.tenantEndDate || "").includes(filters.tenantEndDate)) return false;
      if (filters.discountNames && !String(item.discountNames || "").toLowerCase().includes(filters.discountNames.toLowerCase())) return false;
      if (filters.chargeDefCharge && !String(item.chargeDefCharge || "").includes(filters.chargeDefCharge)) return false;
      if (filters.username && !String(item.username || "").toLowerCase().includes(filters.username.toLowerCase())) return false;
      if (filters.password && !String(item.password || "").toLowerCase().includes(filters.password.toLowerCase())) return false;
      return true;
    });

    if (sortColumn && sortDirection) {
      result.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }
        
        const aStr = String(aVal || "");
        const bStr = String(bVal || "");
        return sortDirection === "asc" 
          ? aStr.localeCompare(bStr, "fa") 
          : bStr.localeCompare(aStr, "fa");
      });
    }

    return result;
  }, [data, filters, sortColumn, sortDirection]);

  // Calculate totals
  const totals = useMemo(() => {
    if (!filteredAndSortedData) return { count: 0, totalCharge: 0, totalMetraj: 0 };
    return {
      count: filteredAndSortedData.length,
      totalCharge: filteredAndSortedData.reduce((sum, item) => sum + Number(item.finalCharge || 0), 0),
      totalMetraj: filteredAndSortedData.reduce((sum, item) => sum + Number(item.metraj || 0), 0),
    };
  }, [filteredAndSortedData]);

  const handleSort = (column: keyof StoreReportData) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") setSortDirection("desc");
      else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setSortColumn(null);
    setSortDirection(null);
  };

  const exportToExcel = () => {
    if (!filteredAndSortedData) return;
    
    const excelData = filteredAndSortedData.map((item) => ({
      "پلاک": item.pelak,
      "نام واحد": item.name,
      "متراژ": item.metraj,
      "بلوک": item.bazar,
      "تراز": item.tabagh,
      "راهرو": item.rahro,
      "نوع": item.nov,
      "وضعیت": item.active,
      "نحوه پرداخت": item.aghsat,
      "تجمیع": item.tajmi,
      "مالکیت": item.malekiyat,
      "تعرفه شارژ": item.chargeDefName,
      "مبلغ تعرفه": item.chargeDefCharge,
      "تخفیف (%)": item.discountPercent,
      "تخفیف‌ها": item.discountNames,
      "شارژ نهایی": item.finalCharge,
      "تعرفه ثابت": item.ejareh,
      "تلفن ۱": item.tel1,
      "تلفن ۲": item.tel2,
      "کد پستی": item.cposti,
      "تحویل": item.Tahvil,
      "تاریخ تغییر": item.changedate,
      "نوع ساکن": item.tenantType,
      "نام ساکن": item.tenantName,
      "تاریخ پایان قرارداد": item.tenantEndDate,
      "توضیحات": item.tovzeh,
      "نام کاربری": item.username,
      "رمز عبور": item.password,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    FileSaver.saveAs(blob, "گزارش_جامع_واحدها.xlsx");
  };

  const SortableHeader = ({ column, title }: { column: keyof StoreReportData; title: string }) => (
    <TableHead
      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-right whitespace-nowrap"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center justify-end gap-1">
        <span>{title}</span>
        {sortColumn === column ? (
          sortDirection === "asc" ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )
        ) : (
          <ArrowUpDown className="h-4 w-4 opacity-30" />
        )}
      </div>
    </TableHead>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-xl font-bold">📊 گزارش جامع واحدها</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportToExcel}
                disabled={!filteredAndSortedData?.length}
              >
                <FileSpreadsheet className="h-4 w-4 ml-2" />
                خروجی اکسل
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Filters Section */}
        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between mb-2">
              <span className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                فیلترها
              </span>
              {isFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <div>
                <label className="text-xs font-medium mb-1 block">پلاک</label>
                <Input
                  placeholder="جستجو..."
                  value={filters.pelak}
                  onChange={(e) => setFilters({ ...filters, pelak: e.target.value })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">نام واحد</label>
                <Input
                  placeholder="جستجو..."
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">بلوک</label>
                <Select value={filters.bazar} onValueChange={(v) => setFilters({ ...filters, bazar: v === "all" ? "" : v })}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه</SelectItem>
                    {uniqueValues.bazar?.map((v) => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">تراز</label>
                <Select value={filters.tabagh} onValueChange={(v) => setFilters({ ...filters, tabagh: v === "all" ? "" : v })}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه</SelectItem>
                    {uniqueValues.tabagh?.map((v) => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">راهرو</label>
                <Select value={filters.rahro} onValueChange={(v) => setFilters({ ...filters, rahro: v === "all" ? "" : v })}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه</SelectItem>
                    {uniqueValues.rahro?.map((v) => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">نوع</label>
                <Select value={filters.nov} onValueChange={(v) => setFilters({ ...filters, nov: v === "all" ? "" : v })}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه</SelectItem>
                    {uniqueValues.nov?.map((v) => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">وضعیت</label>
                <Select value={filters.active} onValueChange={(v) => setFilters({ ...filters, active: v === "all" ? "" : v })}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه</SelectItem>
                    <SelectItem value="فعال">فعال</SelectItem>
                    <SelectItem value="غیر فعال">غیر فعال</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">نحوه پرداخت</label>
                <Select value={filters.aghsat} onValueChange={(v) => setFilters({ ...filters, aghsat: v === "all" ? "" : v })}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه</SelectItem>
                    <SelectItem value="اقساطی">اقساطی</SelectItem>
                    <SelectItem value="نقدی">نقدی</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">تجمیع</label>
                <Select value={filters.tajmi} onValueChange={(v) => setFilters({ ...filters, tajmi: v === "all" ? "" : v })}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه</SelectItem>
                    <SelectItem value="بلی">بلی</SelectItem>
                    <SelectItem value="خیر">خیر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">مالکیت</label>
                <Select value={filters.malekiyat} onValueChange={(v) => setFilters({ ...filters, malekiyat: v === "all" ? "" : v })}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه</SelectItem>
                    <SelectItem value="بلی">بلی</SelectItem>
                    <SelectItem value="خیر">خیر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">تعرفه شارژ</label>
                <Select value={filters.chargeDefName} onValueChange={(v) => setFilters({ ...filters, chargeDefName: v === "all" ? "" : v })}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه</SelectItem>
                    {uniqueValues.chargeDefName?.map((v) => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">نوع ساکن</label>
                <Select value={filters.tenantType} onValueChange={(v) => setFilters({ ...filters, tenantType: v === "all" ? "" : v })}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه</SelectItem>
                    <SelectItem value="مالک">مالک</SelectItem>
                    <SelectItem value="مستاجر">مستاجر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">تلفن ۱</label>
                <Input
                  placeholder="جستجو..."
                  value={filters.tel1}
                  onChange={(e) => setFilters({ ...filters, tel1: e.target.value })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">تلفن ۲</label>
                <Input
                  placeholder="جستجو..."
                  value={filters.tel2}
                  onChange={(e) => setFilters({ ...filters, tel2: e.target.value })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">تعرفه ثابت (ریال)</label>
                <Input
                  placeholder="جستجو..."
                  value={filters.ejareh}
                  onChange={(e) => setFilters({ ...filters, ejareh: e.target.value })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">متراژ</label>
                <Input
                  placeholder="جستجو..."
                  value={filters.metraj}
                  onChange={(e) => setFilters({ ...filters, metraj: e.target.value })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">شارژ نهایی (ریال)</label>
                <Input
                  placeholder="جستجو..."
                  value={filters.finalCharge}
                  onChange={(e) => setFilters({ ...filters, finalCharge: e.target.value })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">تخفیف (%)</label>
                <Input
                  placeholder="جستجو..."
                  value={filters.discountPercent}
                  onChange={(e) => setFilters({ ...filters, discountPercent: e.target.value })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">توضیحات</label>
                <Input
                  placeholder="جستجو..."
                  value={filters.tovzeh}
                  onChange={(e) => setFilters({ ...filters, tovzeh: e.target.value })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">کد پستی</label>
                <Input
                  placeholder="جستجو..."
                  value={filters.cposti}
                  onChange={(e) => setFilters({ ...filters, cposti: e.target.value })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">تاریخ تغییر</label>
                <Input
                  placeholder="جستجو..."
                  value={filters.changedate}
                  onChange={(e) => setFilters({ ...filters, changedate: e.target.value })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">تحویل</label>
                <Input
                  placeholder="جستجو..."
                  value={filters.Tahvil}
                  onChange={(e) => setFilters({ ...filters, Tahvil: e.target.value })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">نام ساکن</label>
                <Input
                  placeholder="جستجو..."
                  value={filters.tenantName}
                  onChange={(e) => setFilters({ ...filters, tenantName: e.target.value })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">تاریخ پایان قرارداد</label>
                <Input
                  placeholder="جستجو..."
                  value={filters.tenantEndDate}
                  onChange={(e) => setFilters({ ...filters, tenantEndDate: e.target.value })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">تخفیف‌ها</label>
                <Input
                  placeholder="جستجو..."
                  value={filters.discountNames}
                  onChange={(e) => setFilters({ ...filters, discountNames: e.target.value })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">مبلغ تعرفه (ریال)</label>
                <Input
                  placeholder="جستجو..."
                  value={filters.chargeDefCharge}
                  onChange={(e) => setFilters({ ...filters, chargeDefCharge: e.target.value })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">نام کاربری</label>
                <Input
                  placeholder="جستجو..."
                  value={filters.username}
                  onChange={(e) => setFilters({ ...filters, username: e.target.value })}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">رمز عبور</label>
                <Input
                  placeholder="جستجو..."
                  value={filters.password}
                  onChange={(e) => setFilters({ ...filters, password: e.target.value })}
                  className="h-8"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 ml-1" />
                پاک کردن فیلترها
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Summary */}
        <div className="flex gap-4 mb-3 flex-wrap">
          <Badge variant="secondary" className="text-sm py-1 px-3">
            تعداد: {formatCurrency(totals.count)} واحد
          </Badge>
          <Badge variant="secondary" className="text-sm py-1 px-3">
            جمع متراژ: {formatCurrency(totals.totalMetraj)} متر
          </Badge>
          <Badge variant="secondary" className="text-sm py-1 px-3">
            جمع شارژ ماهانه: {formatCurrency(totals.totalCharge)} ریال
          </Badge>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto border rounded-lg">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-40 text-red-500">
              خطا در دریافت اطلاعات
            </div>
          ) : (
            <Table>
              <TableHeader className="sticky top-0 bg-white dark:bg-gray-900 z-10">
                <TableRow>
                  <TableHead className="text-center w-12">#</TableHead>
                  <SortableHeader column="pelak" title="پلاک" />
                  <SortableHeader column="name" title="نام واحد" />
                  <SortableHeader column="metraj" title="متراژ" />
                  <SortableHeader column="bazar" title="بلوک" />
                  <SortableHeader column="tabagh" title="تراز" />
                  <SortableHeader column="rahro" title="راهرو" />
                  <SortableHeader column="nov" title="نوع" />
                  <SortableHeader column="active" title="وضعیت" />
                  <SortableHeader column="chargeDefName" title="تعرفه" />
                  <SortableHeader column="finalCharge" title="شارژ نهایی" />
                  <SortableHeader column="discountPercent" title="تخفیف (%)" />
                  <SortableHeader column="tenantType" title="نوع ساکن" />
                  <SortableHeader column="tenantName" title="نام ساکن" />
                  <SortableHeader column="tel1" title="تلفن" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData?.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableCell className="text-center text-gray-500">{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      <Badge variant="outline">{item.pelak}</Badge>
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-left">{formatCurrency(item.metraj)}</TableCell>
                    <TableCell>{item.bazar}</TableCell>
                    <TableCell>{item.tabagh}</TableCell>
                    <TableCell>{item.rahro}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">{item.nov}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.activeRaw ? "default" : "destructive"} className="text-xs">
                        {item.active}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.chargeDefName}</TableCell>
                    <TableCell className="text-left font-medium text-green-600">
                      {formatCurrency(item.finalCharge)}
                    </TableCell>
                    <TableCell className="text-left">
                      {item.discountPercent > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {item.discountPercent}%
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.tenantType && (
                        <Badge variant={item.tenantType === "مالک" ? "default" : "secondary"} className="text-xs">
                          {item.tenantType}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{item.tenantName}</TableCell>
                    <TableCell className="text-sm text-gray-500">{item.tel1}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

