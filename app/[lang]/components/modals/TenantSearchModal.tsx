"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { X, Search, RotateCcw } from "lucide-react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { create } from "zustand";
import { toast } from "sonner";

export interface TenantSearchFilters {
  pelak?: string;
  tfname?: string;
  tlname?: string;
  tmobile?: string;
  tmeli?: string;
  tjob?: string;
  taddress?: string;
  tfather?: string;
  tablo?: string;
  stdateFrom?: string;
  stdateTo?: string;
  endateFrom?: string;
  endateTo?: string;
  datemojavezFrom?: string;
  datemojavezTo?: string;
  created_atFrom?: string;
  created_atTo?: string;
  updated_atFrom?: string;
  updated_atTo?: string;
  sex?: string;
  cposti?: string;
}

interface TenantSearchModalStore {
  isOpen: boolean;
  filters: TenantSearchFilters;
  onOpen: () => void;
  onClose: () => void;
  onApply: (filters: TenantSearchFilters) => void;
  setFilters: (filters: TenantSearchFilters) => void;
}

const useTenantSearchModal = create<TenantSearchModalStore>((set) => ({
  isOpen: false,
  filters: {},
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  onApply: (filters: TenantSearchFilters) => {
    set({ filters, isOpen: false });
  },
  setFilters: (filters: TenantSearchFilters) => set({ filters }),
}));

export const TenantSearchModal = ({
  onSearch,
}: {
  onSearch: (filters: TenantSearchFilters) => void;
}) => {
  const tenantSearchModal = useTenantSearchModal();
  const [localFilters, setLocalFilters] = useState<TenantSearchFilters>({});

  useEffect(() => {
    if (tenantSearchModal.isOpen) {
      setLocalFilters(tenantSearchModal.filters);
    }
  }, [tenantSearchModal.isOpen, tenantSearchModal.filters]);

  const handleApply = () => {
    tenantSearchModal.onApply(localFilters);
    onSearch(localFilters);
    toast.success("جستجو اعمال شد");
  };

  const handleReset = () => {
    const emptyFilters: TenantSearchFilters = {};
    setLocalFilters(emptyFilters);
    tenantSearchModal.setFilters(emptyFilters);
    onSearch(emptyFilters);
    toast.success("فیلترها پاک شدند");
  };

  const updateFilter = (key: keyof TenantSearchFilters, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  return (
    <Dialog
      open={tenantSearchModal.isOpen}
      onOpenChange={(open) => {
        if (!open) {
          tenantSearchModal.onClose();
        }
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            جستجوی پیشرفته مستاجر
          </DialogTitle>
          <DialogDescription>
            از فیلترهای زیر برای جستجوی دقیق‌تر استفاده کنید
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information Filters */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">اطلاعات پایه</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pelak">پلاک</Label>
                <Input
                  id="pelak"
                  placeholder="جستجو در پلاک"
                  value={localFilters.pelak || ""}
                  onChange={(e) => updateFilter("pelak", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tfname">نام</Label>
                <Input
                  id="tfname"
                  placeholder="جستجو در نام"
                  value={localFilters.tfname || ""}
                  onChange={(e) => updateFilter("tfname", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tlname">نام خانوادگی</Label>
                <Input
                  id="tlname"
                  placeholder="جستجو در نام خانوادگی"
                  value={localFilters.tlname || ""}
                  onChange={(e) => updateFilter("tlname", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tmobile">موبایل</Label>
                <Input
                  id="tmobile"
                  placeholder="جستجو در موبایل"
                  value={localFilters.tmobile || ""}
                  onChange={(e) => updateFilter("tmobile", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tmeli">کد ملی</Label>
                <Input
                  id="tmeli"
                  placeholder="جستجو در کد ملی"
                  value={localFilters.tmeli || ""}
                  onChange={(e) => updateFilter("tmeli", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tjob">شغل</Label>
                <Input
                  id="tjob"
                  placeholder="جستجو در شغل"
                  value={localFilters.tjob || ""}
                  onChange={(e) => updateFilter("tjob", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tfather">نام پدر</Label>
                <Input
                  id="tfather"
                  placeholder="جستجو در نام پدر"
                  value={localFilters.tfather || ""}
                  onChange={(e) => updateFilter("tfather", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taddress">آدرس</Label>
                <Input
                  id="taddress"
                  placeholder="جستجو در آدرس"
                  value={localFilters.taddress || ""}
                  onChange={(e) => updateFilter("taddress", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tablo">تابلو</Label>
                <Input
                  id="tablo"
                  placeholder="جستجو در تابلو"
                  value={localFilters.tablo || ""}
                  onChange={(e) => updateFilter("tablo", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cposti">کد پستی</Label>
                <Input
                  id="cposti"
                  placeholder="جستجو در کد پستی"
                  value={localFilters.cposti || ""}
                  onChange={(e) => updateFilter("cposti", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sex">جنسیت</Label>
                <Input
                  id="sex"
                  placeholder="جستجو در جنسیت"
                  value={localFilters.sex || ""}
                  onChange={(e) => updateFilter("sex", e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Date Range Filters */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">فیلتر تاریخ شروع قرارداد</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stdateFrom">از تاریخ</Label>
                <DatePicker
                  value={localFilters.stdateFrom || ""}
                  onChange={(date) =>
                    updateFilter("stdateFrom", date ? date.toString() : undefined)
                  }
                  style={{
                    width: "100%",
                    height: "38px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    padding: "3px 10px",
                  }}
                  format="YYYY/MM/DD"
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-center"
                  placeholder="از تاریخ شروع"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stdateTo">تا تاریخ</Label>
                <DatePicker
                  value={localFilters.stdateTo || ""}
                  onChange={(date) =>
                    updateFilter("stdateTo", date ? date.toString() : undefined)
                  }
                  style={{
                    width: "100%",
                    height: "38px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    padding: "3px 10px",
                  }}
                  format="YYYY/MM/DD"
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-center"
                  placeholder="تا تاریخ شروع"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">فیلتر تاریخ پایان قرارداد</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endateFrom">از تاریخ</Label>
                <DatePicker
                  value={localFilters.endateFrom || ""}
                  onChange={(date) =>
                    updateFilter("endateFrom", date ? date.toString() : undefined)
                  }
                  style={{
                    width: "100%",
                    height: "38px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    padding: "3px 10px",
                  }}
                  format="YYYY/MM/DD"
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-center"
                  placeholder="از تاریخ پایان"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endateTo">تا تاریخ</Label>
                <DatePicker
                  value={localFilters.endateTo || ""}
                  onChange={(date) =>
                    updateFilter("endateTo", date ? date.toString() : undefined)
                  }
                  style={{
                    width: "100%",
                    height: "38px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    padding: "3px 10px",
                  }}
                  format="YYYY/MM/DD"
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-center"
                  placeholder="تا تاریخ پایان"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">فیلتر تاریخ مجوز</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="datemojavezFrom">از تاریخ</Label>
                <DatePicker
                  value={localFilters.datemojavezFrom || ""}
                  onChange={(date) =>
                    updateFilter("datemojavezFrom", date ? date.toString() : undefined)
                  }
                  style={{
                    width: "100%",
                    height: "38px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    padding: "3px 10px",
                  }}
                  format="YYYY/MM/DD"
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-center"
                  placeholder="از تاریخ مجوز"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="datemojavezTo">تا تاریخ</Label>
                <DatePicker
                  value={localFilters.datemojavezTo || ""}
                  onChange={(date) =>
                    updateFilter("datemojavezTo", date ? date.toString() : undefined)
                  }
                  style={{
                    width: "100%",
                    height: "38px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    padding: "3px 10px",
                  }}
                  format="YYYY/MM/DD"
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-center"
                  placeholder="تا تاریخ مجوز"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* System Date Filters */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">فیلتر تاریخ سیستم</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="created_atFrom">تاریخ ایجاد از</Label>
                <DatePicker
                  value={localFilters.created_atFrom || ""}
                  onChange={(date) =>
                    updateFilter("created_atFrom", date ? date.toString() : undefined)
                  }
                  style={{
                    width: "100%",
                    height: "38px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    padding: "3px 10px",
                  }}
                  format="YYYY/MM/DD"
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-center"
                  placeholder="از تاریخ ایجاد"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="created_atTo">تاریخ ایجاد تا</Label>
                <DatePicker
                  value={localFilters.created_atTo || ""}
                  onChange={(date) =>
                    updateFilter("created_atTo", date ? date.toString() : undefined)
                  }
                  style={{
                    width: "100%",
                    height: "38px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    padding: "3px 10px",
                  }}
                  format="YYYY/MM/DD"
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-center"
                  placeholder="تا تاریخ ایجاد"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="updated_atFrom">تاریخ بروزرسانی از</Label>
                <DatePicker
                  value={localFilters.updated_atFrom || ""}
                  onChange={(date) =>
                    updateFilter("updated_atFrom", date ? date.toString() : undefined)
                  }
                  style={{
                    width: "100%",
                    height: "38px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    padding: "3px 10px",
                  }}
                  format="YYYY/MM/DD"
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-center"
                  placeholder="از تاریخ بروزرسانی"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="updated_atTo">تاریخ بروزرسانی تا</Label>
                <DatePicker
                  value={localFilters.updated_atTo || ""}
                  onChange={(date) =>
                    updateFilter("updated_atTo", date ? date.toString() : undefined)
                  }
                  style={{
                    width: "100%",
                    height: "38px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    padding: "3px 10px",
                  }}
                  format="YYYY/MM/DD"
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-center"
                  placeholder="تا تاریخ بروزرسانی"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            پاک کردن فیلترها
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={tenantSearchModal.onClose}>
              انصراف
            </Button>
            <Button onClick={handleApply} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              اعمال جستجو
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default useTenantSearchModal;

