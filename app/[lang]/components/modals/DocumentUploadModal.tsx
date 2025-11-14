"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { create } from "zustand";
import { toast } from "sonner";
import { Trash2, Upload, FileText, Download, Edit, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Badge } from "@/components/ui/badge";
import { FilePreviewModal } from "./FilePreviewModal";


interface UploadedFile {
  id: string | number;
  name: string;
  file?: File;
  isExisting: boolean;
  CatID: number;
  date_?: string;
  Doc_cat?: { title: string };
}

interface DocumentUploadModalData {
  moduleID: number;
  CatID: number;
  pelak?: string;
  rowId: number;
  userID: number;
  categoryTitle?: string;
  existingFiles?: UploadedFile[];
  mode?: "add" | "edit"; // Add mode support
  availableCategories?: Array<{ id: number; title: string }>; // For category editing
}

export const DocumentUploadModal = ({
  mutation,
}: {
  mutation: () => void;
}) => {
  const documentUploadModal = useDocumentUploadModal();
  const data = documentUploadModal.data;
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [filesToDelete, setFilesToDelete] = useState<(string | number)[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [filesToReplace, setFilesToReplace] = useState<Map<string | number, File>>(new Map());
  const [previewFile, setPreviewFile] = useState<{ 
    id?: string | number; 
    name: string; 
    file?: File;
    url?: string;
  } | null>(null);

  useEffect(() => {
    if (data?.existingFiles) {
      setUploadedFiles(data.existingFiles);
    } else {
      setUploadedFiles([]);
    }
    setFilesToDelete([]);
    setFilesToReplace(new Map());
    setSelectedCategoryId(data?.CatID || null);
  }, [data]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log("File selected", { filesCount: files?.length, hasData: !!data });
    
    if (files && data) {
      const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
        id: uuidv4(),
        name: file.name,
        file: file,
        isExisting: false,
        CatID: data.CatID,
      }));
      console.log("Adding new files", newFiles);
      setUploadedFiles((prev) => {
        const updated = [...prev, ...newFiles];
        console.log("Updated uploadedFiles", updated);
        return updated;
      });
      toast.success(`${newFiles.length} فایل انتخاب شد`);
    } else if (!data) {
      toast.error("لطفا صبر کنید تا اطلاعات بارگذاری شود");
    }
    // Reset input to allow selecting the same file again
    event.target.value = '';
  };

  const handleRemoveFile = (fileId: string | number, isExisting: boolean) => {
    if (isExisting) {
      // Mark for deletion from server
      setFilesToDelete((prev) => [...prev, fileId]);
      // Remove from replace map if it was there
      setFilesToReplace((prev) => {
        const newMap = new Map(prev);
        newMap.delete(fileId);
        return newMap;
      });
    }
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleReplaceFile = (fileId: string | number, file: File) => {
    setFilesToReplace((prev) => {
      const newMap = new Map(prev);
      newMap.set(fileId, file);
      return newMap;
    });
  };

  const getModulePath = (moduleID: number) => {
    // 1 = owner, 2 = tenant, 3 = rob, 4 = store, 5 = charge, etc.
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
        return "tenant"; // Default fallback
    }
  };

  const handleDownloadFile = async (fileId: string | number) => {
    if (!data) return;
    
    try {
      const modulePath = getModulePath(data.moduleID);
      const response = await fetch(`/api/${modulePath}/file/${fileId}/download`);
      if (!response.ok) {
        throw new Error("Failed to download file");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = uploadedFiles.find(f => f.id === fileId)?.name || "document";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("فایل دانلود شد");
    } catch (error) {
      toast.error("خطا در دانلود فایل");
    }
  };

  const handleSubmit = async () => {
    console.log("handleSubmit called", { 
      data, 
      uploadedFiles, 
      filesToDelete, 
      filesToReplace: Array.from(filesToReplace.entries()),
      selectedCategoryId 
    });
    
    if (!data) {
      toast.error("اطلاعات لازم موجود نیست");
      return;
    }

    setIsLoading(true);

    try {
      const finalCategoryId = selectedCategoryId || data.CatID;
      const modulePath = getModulePath(data.moduleID);
      const operations: Promise<any>[] = [];

      // 1. Delete marked files
      const deletePromises = filesToDelete.map((fileId) =>
        fetch(`/api/${modulePath}/file/${fileId}`, {
          method: "DELETE",
        }).then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to delete file ${fileId}`);
          }
        })
      );
      operations.push(...deletePromises);

      // 2. Replace existing files (delete old, upload new)
      const replacePromises = Array.from(filesToReplace.entries()).map(async ([oldFileId, newFile]) => {
        // Delete old file
        await fetch(`/api/${modulePath}/file/${oldFileId}`, {
          method: "DELETE",
        });
        
        // Upload new file
        const formData = new FormData();
        formData.append("file", newFile);
        formData.append("moduleID", data.moduleID.toString());
        formData.append("CatID", finalCategoryId.toString());
        formData.append("pelak", data.pelak || "");
        formData.append("rowId", data.rowId.toString());
        formData.append("userID", data.userID.toString());

        const response = await fetch(`/api/${modulePath}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to replace file`);
        }

        return response.json();
      });
      operations.push(...replacePromises);

      // 3. Upload new files (excluding replacement files which are handled separately)
      const replacementFileIds = new Set(Array.from(filesToReplace.keys()).map(id => `replace-${id}`));
      const newFiles = uploadedFiles.filter((f) => 
        !f.isExisting && 
        f.file && 
        !replacementFileIds.has(f.id.toString())
      );
      
      const uploadPromises = newFiles.map(async (fileData) => {
        const formData = new FormData();
        formData.append("file", fileData.file!);
        formData.append("moduleID", data.moduleID.toString());
        formData.append("CatID", finalCategoryId.toString());
        formData.append("pelak", data.pelak || "");
        formData.append("rowId", data.rowId.toString());
        formData.append("userID", data.userID.toString());

        const response = await fetch(`/api/${modulePath}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to upload ${fileData.name}`);
        }

        return response.json();
      });
      operations.push(...uploadPromises);

      // 4. Update category for existing files if changed
      if (selectedCategoryId && selectedCategoryId !== data.CatID) {
        const existingFileIds = uploadedFiles
          .filter(f => f.isExisting && !filesToDelete.includes(f.id) && !filesToReplace.has(f.id))
          .map(f => f.id);
        
        const updatePromises = existingFileIds.map((fileId) =>
          fetch(`/api/${modulePath}/file/${fileId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              CatID: selectedCategoryId,
            }),
          }).then((res) => {
            if (!res.ok) {
              throw new Error(`Failed to update file ${fileId}`);
            }
            return res.json();
          })
        );
        operations.push(...updatePromises);
      }
      
      if (operations.length === 0) {
        toast("هیچ تغییری اعمال نشد", { duration: 2000 });
        setIsLoading(false);
        return;
      }

      await Promise.all(operations);

      const actionText = data.mode === "edit" ? "ویرایش شدند" : "آپلود شدند";
      toast.success(`فایل‌ها با موفقیت ${actionText}`);
      documentUploadModal.onClose();
      if (mutation) {
        await mutation();
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "خطا در آپلود فایل‌ها");
    } finally {
      setIsLoading(false);
    }
  };

  const bodyContent = (
    <div className="space-y-4">
      {/* Category Selection (for edit mode) */}
      {data?.mode === "edit" && data?.availableCategories && (
        <div className="space-y-2">
          <label className="text-sm font-medium">دسته‌بندی:</label>
          <Select
            value={selectedCategoryId?.toString() || ""}
            onValueChange={(value) => setSelectedCategoryId(parseInt(value))}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="انتخاب دسته‌بندی" />
            </SelectTrigger>
            <SelectContent>
              {data.availableCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {!data?.mode || data.mode === "add" ? (
        data?.categoryTitle && (
          <div className="text-sm text-gray-600">
            دسته‌بندی: <span className="font-semibold">{data.categoryTitle}</span>
          </div>
        )
      ) : null}

      {/* File Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
        <Input
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
          disabled={isLoading}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          <Upload className="h-12 w-12 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600 font-medium">
            کلیک کنید یا فایل‌ها را اینجا بکشید
          </span>
          <span className="text-xs text-gray-400 mt-1">
            می‌توانید چندین فایل را برای این سند انتخاب کنید
          </span>
          <span className="text-xs text-gray-400">
            PDF, DOC, DOCX, JPG, PNG (حداکثر 10MB)
          </span>
        </label>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          {/* Existing Files Section */}
          {uploadedFiles.filter(f => f.isExisting).length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">
                  فایل‌های موجود ({uploadedFiles.filter(f => f.isExisting).length})
                </h4>
                <Badge variant="secondary">موجود</Badge>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {uploadedFiles
                  .filter(f => f.isExisting)
                  .map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {file.Doc_cat?.title || ""} - {file.date_ ? new Date(file.date_).toLocaleDateString('fa-IR') : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        {data?.mode === "edit" && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setPreviewFile({ id: file.id, name: file.name })}
                            disabled={isLoading}
                            title="پیش‌نمایش"
                          >
                            <Eye className="h-4 w-4 text-purple-500" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadFile(file.id)}
                          disabled={isLoading}
                          title="دانلود"
                        >
                          <Download className="h-4 w-4 text-blue-500" />
                        </Button>
                        {data?.mode === "edit" && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif";
                              input.onchange = (e) => {
                                const newFile = (e.target as HTMLInputElement).files?.[0];
                                if (newFile) {
                                  handleReplaceFile(file.id, newFile);
                                  // Add the replacement file to the list as a new file
                                  const replacementFile: UploadedFile = {
                                    id: `replace-${file.id}`,
                                    name: newFile.name,
                                    file: newFile,
                                    isExisting: false,
                                    CatID: file.CatID,
                                  };
                                  setUploadedFiles((prev) => [...prev, replacementFile]);
                                  toast.success(`فایل ${newFile.name} برای جایگزینی انتخاب شد`);
                                }
                              };
                              input.click();
                            }}
                            disabled={isLoading}
                            title="جایگزین کردن"
                          >
                            <Edit className="h-4 w-4 text-green-500" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(file.id, file.isExisting)}
                          disabled={isLoading}
                          title="حذف"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* New Files Section */}
          {uploadedFiles.filter(f => !f.isExisting).length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">
                  فایل‌های جدید ({uploadedFiles.filter(f => !f.isExisting).length})
                </h4>
                <Badge variant="default">جدید</Badge>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2">
                  {uploadedFiles
                  .filter(f => !f.isExisting)
                  .map((file) => {
                    return (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            {file.file && (
                              <p className="text-xs text-gray-500">
                                {(file.file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          {file.file && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setPreviewFile({ 
                                name: file.name, 
                                file: file.file 
                              })}
                              disabled={isLoading}
                              title="پیش‌نمایش"
                            >
                              <Eye className="h-4 w-4 text-purple-500" />
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(file.id, file.isExisting)}
                            disabled={isLoading}
                            title="حذف از لیست"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <FilePreviewModal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        fileId={previewFile?.id}
        fileName={previewFile?.name || ""}
        file={previewFile?.file}
        fileUrl={previewFile?.url}
        moduleID={data?.moduleID}
      />
      <Dialog open={documentUploadModal.isOpen} onOpenChange={documentUploadModal.onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {data?.mode === "edit" ? "ویرایش مدارک" : "آپلود مدارک"}
          </DialogTitle>
          <DialogDescription>
            {data?.mode === "edit" 
              ? "می‌توانید فایل‌های موجود را ویرایش، حذف یا جایگزین کنید و فایل‌های جدید اضافه کنید."
              : "فایل‌های مدارک خود را آپلود کنید. می‌توانید چندین فایل را برای یک سند انتخاب کنید."}
          </DialogDescription>
        </DialogHeader>
        {bodyContent}
        {!data && (
          <div className="text-sm text-red-500 p-2">
            ⚠️ اطلاعات لازم موجود نیست. لطفا دوباره تلاش کنید.
          </div>
        )}
        {data && uploadedFiles.filter(f => !f.isExisting).length === 0 && filesToDelete.length === 0 && (
          <div className="text-sm text-gray-500 p-2">
            لطفا فایلی انتخاب کنید یا فایلی را برای حذف انتخاب کنید.
          </div>
        )}
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              documentUploadModal.onClose();
            }}
            disabled={isLoading}
          >
            انصراف
          </Button>
          <Button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Upload button clicked", {
                hasData: !!data,
                newFilesCount: uploadedFiles.filter(f => !f.isExisting).length,
                deleteCount: filesToDelete.length,
                isLoading,
              });
              handleSubmit();
            }}
            disabled={
              isLoading || 
              !data ||
              (uploadedFiles.filter(f => !f.isExisting).length === 0 && 
               filesToDelete.length === 0 && 
               filesToReplace.size === 0 &&
               (!selectedCategoryId || selectedCategoryId === data.CatID))
            }
            className="min-w-[100px]"
          >
            {isLoading 
              ? (data?.mode === "edit" ? "در حال ذخیره..." : "در حال آپلود...") 
              : (data?.mode === "edit" ? "ذخیره تغییرات" : "آپلود")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};

// Zustand store for modal state
interface DocumentUploadModalStore {
  isOpen: boolean;
  data?: DocumentUploadModalData;
  onOpen: (data: DocumentUploadModalData) => void;
  onClose: () => void;
}

const useDocumentUploadModal = create<DocumentUploadModalStore>((set) => ({
  isOpen: false,
  data: undefined,
  onOpen: (data) => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false, data: undefined }),
}));

export default useDocumentUploadModal;

