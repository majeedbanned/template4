"use client";

import { useEffect, useState, useMemo } from "react";
import { create } from "zustand";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Download,
  Eye,
  FileText,
  File,
  Image as ImageIcon,
  Search,
  LayoutGrid,
  List,
  Calendar,
  Folder,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { FilePreviewModal } from "./FilePreviewModal";

interface DocumentFile {
  id: string | number;
  name: string;
  CatID: number;
  date_?: string;
  Doc_cat?: { title: string };
  moduleID?: number;
}

interface ViewAllDocumentsModalData {
  pelak?: string;
  documents: DocumentFile[];
  moduleID: number;
}

interface ViewAllDocumentsModalStore {
  isOpen: boolean;
  data: ViewAllDocumentsModalData | null;
  onOpen: (data: ViewAllDocumentsModalData) => void;
  onClose: () => void;
}

export const useViewAllDocumentsModal = create<ViewAllDocumentsModalStore>(
  (set) => ({
    isOpen: false,
    data: null,
    onOpen: (data) => set({ isOpen: true, data }),
    onClose: () => set({ isOpen: false, data: null }),
  })
);

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
      return "store";
  }
};

export const ViewAllDocumentsModal = () => {
  const viewAllDocumentsModal = useViewAllDocumentsModal();
  const [previewFile, setPreviewFile] = useState<{
    id?: string | number;
    name: string;
    url?: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const data = viewAllDocumentsModal.data;

  // Group documents by category
  const groupedDocuments = useMemo(() => {
    if (!data?.documents) return {};
    return data.documents.reduce((acc, doc) => {
      const categoryTitle = doc.Doc_cat?.title || "بدون دسته‌بندی";
      if (!acc[categoryTitle]) {
        acc[categoryTitle] = [];
      }
      acc[categoryTitle].push(doc);
      return acc;
    }, {} as Record<string, DocumentFile[]>);
  }, [data?.documents]);

  const categories = Object.keys(groupedDocuments);

  // Calculate statistics
  const totalDocuments = data?.documents.length || 0;
  const totalCategories = categories.length;

  // Filter documents based on search query
  const filteredGroupedDocuments = useMemo(() => {
    if (!searchQuery.trim()) return groupedDocuments;

    const filtered: Record<string, DocumentFile[]> = {};
    Object.keys(groupedDocuments).forEach((category) => {
      const filteredDocs = groupedDocuments[category].filter((doc) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          doc.Doc_cat?.title?.toLowerCase().includes(searchLower) ||
          doc.name.toLowerCase().includes(searchLower) ||
          category.toLowerCase().includes(searchLower)
        );
      });
      if (filteredDocs.length > 0) {
        filtered[category] = filteredDocs;
      }
    });
    return filtered;
  }, [groupedDocuments, searchQuery]);

  const filteredCategories = Object.keys(filteredGroupedDocuments);

  // Set default selected category
  useEffect(() => {
    if (filteredCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(filteredCategories[0]);
    }
  }, [filteredCategories, selectedCategory]);

  const handleDownload = async (fileId: string | number, fileName: string) => {
    if (!data) return;

    try {
      const modulePath = getModulePath(data.moduleID);
      const response = await fetch(`/api/${modulePath}/file/${fileId}/download`);
      
      if (!response.ok) {
        throw new Error("خطا در دانلود فایل");
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
      toast.success("فایل با موفقیت دانلود شد");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("خطا در دانلود فایل");
    }
  };

  const handlePreview = async (fileId: string | number, fileName: string) => {
    if (!data) return;

    try {
      const modulePath = getModulePath(data.moduleID);
      const url = `/api/${modulePath}/file/${fileId}/download`;
      setPreviewFile({ id: fileId, name: fileName, url });
    } catch (error) {
      console.error("Preview error:", error);
      toast.error("خطا در نمایش فایل");
    }
  };

  const getFileExtension = (fileName: string) => {
    return fileName.split(".").pop()?.toLowerCase() || "";
  };

  const isImage = (fileName: string) => {
    const ext = getFileExtension(fileName);
    return ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(ext);
  };

  const isPdf = (fileName: string) => {
    return getFileExtension(fileName) === "pdf";
  };

  const getFileIcon = (fileName: string) => {
    if (isImage(fileName)) return ImageIcon;
    if (isPdf(fileName)) return FileText;
    return File;
  };

  const getFileTypeColor = (fileName: string) => {
    if (isImage(fileName)) return "bg-blue-100 text-blue-700 border-blue-200";
    if (isPdf(fileName)) return "bg-red-100 text-red-700 border-red-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "نامشخص";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <>
      <Dialog
        open={viewAllDocumentsModal.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            viewAllDocumentsModal.onClose();
            setSearchQuery("");
            setViewMode("grid");
            setSelectedCategory(null);
          }
        }}
      >
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Folder className="h-6 w-6 text-primary" />
                  مشاهده تمام اسناد
                </DialogTitle>
                <DialogDescription className="mt-2 flex items-center gap-4">
                  {data?.pelak && (
                    <Badge variant="outline" className="text-sm">
                      پلاک: {data.pelak}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-sm">
                    {totalDocuments} سند در {totalCategories} دسته‌بندی
                  </Badge>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-600 mb-2">
                هیچ سندی یافت نشد
              </p>
              <p className="text-sm text-gray-500">
                برای افزودن سند جدید از منوی اسناد استفاده کنید
              </p>
            </div>
          ) : (
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Search and View Mode Controls */}
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="جستجو در اسناد..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2 border rounded-md p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Tabs and Content */}
              <div className="flex-1 overflow-hidden flex flex-col mt-4">
                <Tabs
                  value={selectedCategory || filteredCategories[0]}
                  onValueChange={setSelectedCategory}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <TabsList className="flex flex-wrap gap-2 h-auto p-1 mb-4 justify-start overflow-x-auto">
                    {filteredCategories.map((category) => (
                      <TabsTrigger
                        key={category}
                        value={category}
                        className="text-sm px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        <Folder className="h-4 w-4 ml-2" />
                        {category}
                        <Badge
                          variant="secondary"
                          className="mr-2 bg-background/50"
                        >
                          {filteredGroupedDocuments[category].length}
                        </Badge>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <div className="flex-1 overflow-y-auto">
                    {filteredCategories.map((category) => (
                      <TabsContent
                        key={category}
                        value={category}
                        className="mt-0 space-y-3"
                      >
                        {filteredGroupedDocuments[category].length === 0 ? (
                          <div className="text-center py-12 text-gray-500">
                            هیچ سندی در این دسته‌بندی یافت نشد
                          </div>
                        ) : viewMode === "grid" ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredGroupedDocuments[category].map((doc) => {
                              const FileIcon = getFileIcon(doc.name);
                              return (
                                <Card
                                  key={doc.id}
                                  className="hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50"
                                >
                                  <CardContent className="p-4">
                                    <div className="flex flex-col h-full">
                                      {/* File Icon and Type */}
                                      <div className="flex items-start justify-between mb-3">
                                        <div
                                          className={`p-3 rounded-lg border-2 ${getFileTypeColor(
                                            doc.name
                                          )}`}
                                        >
                                          <FileIcon className="h-6 w-6" />
                                        </div>
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {getFileExtension(doc.name).toUpperCase()}
                                        </Badge>
                                      </div>

                                      {/* File Info */}
                                      <div className="flex-1 mb-3">
                                        <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                                          {doc.Doc_cat?.title || "بدون عنوان"}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                          <Calendar className="h-3 w-3" />
                                          <span>{formatDate(doc.date_)}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 truncate">
                                          {doc.name}
                                        </p>
                                      </div>

                                      {/* Actions */}
                                      <div className="flex items-center gap-2 pt-3 border-t">
                                        {(isImage(doc.name) ||
                                          isPdf(doc.name)) && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              handlePreview(doc.id, doc.name)
                                            }
                                            className="flex-1 text-xs"
                                          >
                                            <Eye className="h-3 w-3 ml-1" />
                                            مشاهده
                                          </Button>
                                        )}
                                        <Button
                                          variant="default"
                                          size="sm"
                                          onClick={() =>
                                            handleDownload(doc.id, doc.name)
                                          }
                                          className="flex-1 text-xs"
                                        >
                                          <Download className="h-3 w-3 ml-1" />
                                          دانلود
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {filteredGroupedDocuments[category].map((doc) => {
                              const FileIcon = getFileIcon(doc.name);
                              return (
                                <Card
                                  key={doc.id}
                                  className="hover:shadow-md transition-all duration-200"
                                >
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between gap-4">
                                      <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div
                                          className={`p-2 rounded-lg border-2 flex-shrink-0 ${getFileTypeColor(
                                            doc.name
                                          )}`}
                                        >
                                          <FileIcon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-sm truncate">
                                              {doc.Doc_cat?.title ||
                                                "بدون عنوان"}
                                            </h4>
                                            <Badge
                                              variant="outline"
                                              className="text-xs flex-shrink-0"
                                            >
                                              {getFileExtension(
                                                doc.name
                                              ).toUpperCase()}
                                            </Badge>
                                          </div>
                                          <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                              <Calendar className="h-3 w-3" />
                                              <span>{formatDate(doc.date_)}</span>
                                            </div>
                                            <span className="truncate">
                                              {doc.name}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2 flex-shrink-0">
                                        {(isImage(doc.name) ||
                                          isPdf(doc.name)) && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              handlePreview(doc.id, doc.name)
                                            }
                                          >
                                            <Eye className="h-4 w-4 ml-1" />
                                            مشاهده
                                          </Button>
                                        )}
                                        <Button
                                          variant="default"
                                          size="sm"
                                          onClick={() =>
                                            handleDownload(doc.id, doc.name)
                                          }
                                        >
                                          <Download className="h-4 w-4 ml-1" />
                                          دانلود
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        )}
                      </TabsContent>
                    ))}
                  </div>
                </Tabs>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {previewFile && (
        <FilePreviewModal
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
          fileId={previewFile.id}
          fileName={previewFile.name}
          fileUrl={previewFile.url}
          moduleID={data?.moduleID}
        />
      )}
    </>
  );
};

