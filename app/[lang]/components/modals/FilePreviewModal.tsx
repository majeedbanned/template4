"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";
import { toast } from "sonner";

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileId?: string | number;
  fileName: string;
  fileUrl?: string; // Optional direct URL
  file?: File; // Optional File object for previewing before upload
  moduleID?: number; // Module ID to determine API path (1=owner, 2=tenant)
}

export const FilePreviewModal = ({
  isOpen,
  onClose,
  fileId,
  fileName,
  fileUrl,
  file,
  moduleID = 2, // Default to tenant
}: FilePreviewModalProps) => {
  const getModulePath = (moduleID: number) => {
    switch (moduleID) {
      case 1:
        return "owner";
      case 2:
        return "tenant";
      case 3:
        return "rob";
      case 4:
        return "store";
      case 5:
        return "charge";
      default:
        return "tenant";
    }
  };
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension);
  const isPdf = fileExtension === "pdf";

  useEffect(() => {
    if (isOpen) {
      // If file object is provided, create preview from it
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setIsLoading(false);
      } else if (fileId) {
        loadPreview();
      } else if (fileUrl) {
        setPreviewUrl(fileUrl);
        setIsLoading(false);
      }
    } else {
      // Cleanup preview URL when modal closes
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setError(null);
    }

    // Cleanup on unmount
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [isOpen, fileId, file, fileUrl]);

  const loadPreview = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // If direct URL provided, use it
      if (fileUrl) {
        setPreviewUrl(fileUrl);
        setIsLoading(false);
        return;
      }

      // Otherwise, fetch from API
      const modulePath = getModulePath(moduleID);
      const response = await fetch(`/api/${modulePath}/file/${fileId}/download`);
      
      if (!response.ok) {
        throw new Error("Failed to load file");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (err: any) {
      setError(err.message || "خطا در بارگذاری فایل");
      toast.error("خطا در بارگذاری فایل");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!fileId) return;
    
    try {
      const modulePath = getModulePath(moduleID);
      const response = await fetch(`/api/${modulePath}/file/${fileId}/download`);
      if (!response.ok) {
        throw new Error("Failed to download file");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("فایل دانلود شد");
    } catch (error) {
      toast.error("خطا در دانلود فایل");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] max-w-[95vw] h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="truncate flex-1 mr-4">{fileName}</DialogTitle>
            <div className="flex gap-2">
              {fileId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={isLoading || !!error}
                >
                  <Download className="h-4 w-4 mr-2" />
                  دانلود
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden bg-gray-100 flex items-center justify-center p-4">
          {isLoading && (
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="text-sm text-gray-600">در حال بارگذاری...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-4">
              <p className="text-red-500">{error}</p>
              <Button onClick={loadPreview} variant="outline">
                تلاش مجدد
              </Button>
            </div>
          )}

          {!isLoading && !error && previewUrl && (
            <>
              {isImage && (
                <div className="max-w-full max-h-full flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt={fileName}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                    onError={() => setError("خطا در نمایش تصویر")}
                  />
                </div>
              )}

              {isPdf && (
                <div className="w-full h-full flex flex-col">
                  <iframe
                    src={previewUrl}
                    className="w-full h-full border-0 rounded-lg shadow-lg"
                    title={fileName}
                  />
                </div>
              )}

              {!isImage && !isPdf && (
                <div className="flex flex-col items-center gap-4 p-8">
                  <div className="text-6xl">📄</div>
                  <p className="text-gray-600">
                    پیش‌نمایش برای این نوع فایل در دسترس نیست
                  </p>
                  {fileId && (
                    <Button onClick={handleDownload} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      دانلود فایل
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

