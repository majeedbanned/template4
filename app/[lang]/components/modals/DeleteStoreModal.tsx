"use client";

import { useCallback, useMemo, useState } from "react";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export const DeleteStoreModal = ({
  mutation,
  data,
  delLabel1,
  delLabel2,
}: {
  mutation: () => void;
  data: string;
  delLabel1: string;
  delLabel2: string;
}) => {
  const router = useRouter();
  const _DeleteStoreModal = useDeleteStoreModal();
  const [isLoading, setIsLoading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [editstore, setEditstore] = useState<z.infer<typeof StoreSchema>>();
  const [tmp, setTmp] = useState(false);

  const [error, setError] = useState("");

  const form = useForm();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log("deleted >" + _DeleteStoreModal.editID);
    const promise = () =>
      new Promise((resolve) => {
        setIsLoading(true);
        fetch(`/api/store/${_DeleteStoreModal.editID}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }).then(async (res) => {
          setIsLoading(false);
          if (res.status === 200) {
            toast.success(`اطلاعات با موفقیت حذف شد`);
            mutation();
            _DeleteStoreModal.onClose();
            resolve("");
          } else {
            const error = await res.text();
            toast.error(error);
            rejects;
          }
        });
      });

    toast.promise(promise, {
      loading: "حذف اطلاعات ...",
      success: (data) => {
        toast.dismiss();

        return `${data} `;
      },
      error: "Error",
    });

    return;

    console.log(data);
    setIsLoading(true);
    await fetch(endpoint.url, {
      method: endpoint.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(async (res) => {
      await setTimeout(async () => {
        setIsLoading(false);
        if (res.status === 200) {
          //** */ mutate(`/api/projects/${slug}/domains`);
          _DeleteStoreModal.onClose();
          toast.success(endpoint.successMessage);
          await mutation();
          // mutate(`/api/store`, true).then((resp) => {
          //   setTmp(!tmp);
          // });

          // if (!props) {
          //   router.push(`/${slug}/domains`);
          // }
        } else if (res.status === 422) {
          //  const { domainError: domainErrorResponse } = await res.json();
          // if (domainErrorResponse) {
          toast.error("پلاک تکراری است");
        } else {
          toast.error(res.statusText);
        }
      }, 3);
    });
  };

  const onToggle = useCallback(() => {
    _DeleteStoreModal.onClose();
    //  registerModal.onOpen();
  }, [_DeleteStoreModal]);

  const endpoint = useMemo(() => {
    if (_DeleteStoreModal.editID !== "") {
      return {
        method: "PUT",
        url: `/api/store`,
        successMessage: "اطلاعات با موفقیت ویرایش شد",
      };
    } else {
      return {
        method: "POST",
        url: `/api/store`,
        successMessage: "اطلاعات با موفقیت ذخیره شد",
      };
    }
  }, [_DeleteStoreModal.editID]);

  const bodyContent = (
    <div className="flex items-center gap-3 rounded-md border border-gray-300 bg-white p-3">
      <TrashIcon
        width={40}
        height={40}
        className="overflow-hidden rounded-full text-red-500 border-gray-200"
      />
      <div className="flex flex-col">
        <h3 className="text-sm font-medium">{delLabel1}</h3>
        <p className="text-xs text-gray-500">{delLabel2}</p>
      </div>
    </div>
  );

  const footerContent = <div className="flex flex-col gap-4 mt-3"></div>;

  // if (hooksCompleted !== 4) return null;
  return (
    <Modal
      disabled={isLoading}
      isOpen={_DeleteStoreModal.isOpen}
      title="حذف اطلاعات"
      // "افزودن واحد"
      actionLabel="حذف"
      actionLabelVariant="destructive"
      secondaryActionLabel="انصراف"
      secondaryAction={_DeleteStoreModal.onClose}
      onClose={_DeleteStoreModal.onClose}
      onSubmit={form.handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
      description="در صورت تایید , این ردیف حذف خواهد شد"
    />
  );
};

import { create } from "zustand";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { StoreSchema } from "@/lib/schemas";
import Modal from "./Modal";
import { DeleteIcon } from "lucide-react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { rejects } from "assert";

interface DeleteStoreModal {
  isOpen: boolean;
  editID: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

const useDeleteStoreModal = create<DeleteStoreModal>((set) => ({
  isOpen: false,
  editID: "",
  onOpen: (id) => set({ isOpen: true, editID: id }),
  onClose: () => set({ isOpen: false }),
}));

export default useDeleteStoreModal;
