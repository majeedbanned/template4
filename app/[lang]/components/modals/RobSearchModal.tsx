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

export interface RobSearchFilters {
  pelak?: string;
  disc?: string;
  paydiscription?: string;
  invitedateFrom?: string;
  invitedateTo?: string;
  paydateFrom?: string;
  paydateTo?: string;
  created_atFrom?: string;
  created_atTo?: string;
  updated_atFrom?: string;
  updated_atTo?: string;
  priceMin?: number;
  priceMax?: number;
  created_user?: number;
  updated_user?: number;
}

interface RobSearchModalStore {
  isOpen: boolean;
  filters: RobSearchFilters;
  onOpen: () => void;
  onClose: () => void;
  onApply: (filters: RobSearchFilters) => void;
  setFilters: (filters: RobSearchFilters) => void;
}

const useRobSearchModal = create<RobSearchModalStore>((set) => ({
  isOpen: false,
  filters: {},
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  onApply: (filters: RobSearchFilters) => {
    set({ filters, isOpen: false });
  },
  setFilters: (filters: RobSearchFilters) => set({ filters }),
}));

export const RobSearchModal = ({
  onSearch,
}: {
  onSearch: (filters: RobSearchFilters) => void;
}) => {
  const robSearchModal = useRobSearchModal();
  const [localFilters, setLocalFilters] = useState<RobSearchFilters>({});

  useEffect(() => {
    if (robSearchModal.isOpen) {
      setLocalFilters(robSearchModal.filters);
    }
  }, [robSearchModal.isOpen, robSearchModal.filters]);

  const handleApply = () => {
    // Validate price range
    if (
      localFilters.priceMin !== undefined &&
      localFilters.priceMax !== undefined &&
      localFilters.priceMin > localFilters.priceMax
    ) {
      toast.error("حداقل مبلغ نمی‌تواند بیشتر از حداکثر مبلغ باشد");
      return;
    }

    robSearchModal.onApply(localFilters);
    onSearch(localFilters);
    toast.success("جستجو اعمال شد");
  };

  const handleReset = () => {
    const emptyFilters: RobSearchFilters = {};
    setLocalFilters(emptyFilters);
    robSearchModal.setFilters(emptyFilters);
    onSearch(emptyFilters);
    toast.success("فیلترها پاک شدند");
  };

  const updateFilter = (key: keyof RobSearchFilters, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const bodyContent = (
    <div className="space-y-6 py-4">
      {/* Text Search Fields */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">جستجوی متنی</h3>
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
            <Label htmlFor="disc">توضیحات</Label>
            <Input
              id="disc"
              placeholder="جستجو در توضیحات"
              value={localFilters.disc || ""}
              onChange={(e) => updateFilter("disc", e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="paydiscription">توضیحات پرداخت</Label>
            <Input
              id="paydiscription"
              placeholder="جستجو در توضیحات پرداخت"
              value={localFilters.paydiscription || ""}
              onChange={(e) => updateFilter("paydiscription", e.target.value)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Date Range Filters */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">فیلتر تاریخ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Invitation Date Range */}
          <div className="space-y-2">
            <Label>تاریخ دعوتنامه</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <DatePicker
                  placeholder="از تاریخ"
                  value={localFilters.invitedateFrom || ""}
                  onChange={(date: any) =>
                    updateFilter(
                      "invitedateFrom",
                      date ? date.toString() : undefined
                    )
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
                />
              </div>
              <div className="flex-1">
                <DatePicker
                  placeholder="تا تاریخ"
                  value={localFilters.invitedateTo || ""}
                  onChange={(date: any) =>
                    updateFilter(
                      "invitedateTo",
                      date ? date.toString() : undefined
                    )
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
                />
              </div>
            </div>
          </div>

          {/* Payment Date Range */}
          <div className="space-y-2">
            <Label>تاریخ پرداخت</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <DatePicker
                  placeholder="از تاریخ"
                  value={localFilters.paydateFrom || ""}
                  onChange={(date: any) =>
                    updateFilter(
                      "paydateFrom",
                      date ? date.toString() : undefined
                    )
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
                />
              </div>
              <div className="flex-1">
                <DatePicker
                  placeholder="تا تاریخ"
                  value={localFilters.paydateTo || ""}
                  onChange={(date: any) =>
                    updateFilter(
                      "paydateTo",
                      date ? date.toString() : undefined
                    )
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
                />
              </div>
            </div>
          </div>

          {/* Created Date Range */}
          <div className="space-y-2">
            <Label>تاریخ ایجاد</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <DatePicker
                  placeholder="از تاریخ"
                  value={localFilters.created_atFrom || ""}
                  onChange={(date: any) =>
                    updateFilter(
                      "created_atFrom",
                      date ? date.toString() : undefined
                    )
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
                />
              </div>
              <div className="flex-1">
                <DatePicker
                  placeholder="تا تاریخ"
                  value={localFilters.created_atTo || ""}
                  onChange={(date: any) =>
                    updateFilter(
                      "created_atTo",
                      date ? date.toString() : undefined
                    )
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
                />
              </div>
            </div>
          </div>

          {/* Updated Date Range */}
          <div className="space-y-2">
            <Label>تاریخ ویرایش</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <DatePicker
                  placeholder="از تاریخ"
                  value={localFilters.updated_atFrom || ""}
                  onChange={(date: any) =>
                    updateFilter(
                      "updated_atFrom",
                      date ? date.toString() : undefined
                    )
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
                />
              </div>
              <div className="flex-1">
                <DatePicker
                  placeholder="تا تاریخ"
                  value={localFilters.updated_atTo || ""}
                  onChange={(date: any) =>
                    updateFilter(
                      "updated_atTo",
                      date ? date.toString() : undefined
                    )
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
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Price Range Filter */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">فیلتر مبلغ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="priceMin">حداقل مبلغ (ریال)</Label>
            <Input
              id="priceMin"
              type="number"
              placeholder="حداقل مبلغ"
              value={localFilters.priceMin || ""}
              onChange={(e) =>
                updateFilter(
                  "priceMin",
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priceMax">حداکثر مبلغ (ریال)</Label>
            <Input
              id="priceMax"
              type="number"
              placeholder="حداکثر مبلغ"
              value={localFilters.priceMax || ""}
              onChange={(e) =>
                updateFilter(
                  "priceMax",
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* User Filters */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">فیلتر کاربر</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="created_user">کاربر ایجاد کننده</Label>
            <Input
              id="created_user"
              type="number"
              placeholder="شناسه کاربر"
              value={localFilters.created_user || ""}
              onChange={(e) =>
                updateFilter(
                  "created_user",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="updated_user">کاربر ویرایش کننده</Label>
            <Input
              id="updated_user"
              type="number"
              placeholder="شناسه کاربر"
              value={localFilters.updated_user || ""}
              onChange={(e) =>
                updateFilter(
                  "updated_user",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={robSearchModal.isOpen} onOpenChange={robSearchModal.onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>جستجوی پیشرفته سرقفلی</DialogTitle>
          <DialogDescription>
            از فیلترهای زیر برای جستجوی دقیق‌تر استفاده کنید
          </DialogDescription>
        </DialogHeader>
        {bodyContent}
        <DialogFooter className="flex flex-row gap-2 justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            پاک کردن فیلترها
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={robSearchModal.onClose}
            >
              انصراف
            </Button>
            <Button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              اعمال جستجو
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default useRobSearchModal;

