"use client";

import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
export const DeleteChargeModal = ({
  mutation,
  data,
  row,
}: {
  mutation: () => void;
  data: string;
  row: any;
}) => {
  const _DeleteStoreModal = useDeleteChargeModal();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm();
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    //console.log("deleted >" + _DeleteStoreModal.editID);
    const promise = () =>
      new Promise((resolve) => {
        setIsLoading(true);
        fetch(`/api/charge/${_DeleteStoreModal.editID}`, {
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
  };

  const bodyContent = (
    <div className="flex items-center gap-3 rounded-md border border-gray-300 bg-white p-3">
      <TrashIcon
        width={40}
        height={40}
        className="overflow-hidden rounded-full text-red-500 border-gray-200"
      />
      <div className="flex flex-col">
        <h3 className="text-sm font-medium">{row?.pelak}</h3>
        <p className="text-xs text-gray-500">{row?.month}</p>
        <p className="text-xs text-gray-500">{row?.id}</p>
      </div>
    </div>
  );

  const footerContent = <div className="flex flex-col gap-4 mt-3"></div>;

  return (
    <Modal
      disabled={isLoading}
      isOpen={_DeleteStoreModal.isOpen}
      title="حذف اطلاعات"
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
import { toast } from "sonner";
import Modal from "./Modal";
import { TrashIcon } from "@heroicons/react/24/outline";
import { rejects } from "assert";

interface DeleteChargeModal {
  isOpen: boolean;
  editID: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

const useDeleteChargeModal = create<DeleteChargeModal>((set) => ({
  isOpen: false,
  editID: "",
  onOpen: (id) => set({ isOpen: true, editID: id }),
  onClose: () => set({ isOpen: false }),
}));

export default useDeleteChargeModal;
