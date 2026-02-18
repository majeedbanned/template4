"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Modal from "./Modal";

interface SendSMSModalPayload {
  phone?: string;
  schoolCode?: string;
  label?: string;
}

interface SendSMSModalStore {
  isOpen: boolean;
  phone: string;
  schoolCode?: string;
  label?: string;
  onOpen: (payload?: SendSMSModalPayload) => void;
  onClose: () => void;
}

export const SendSMSModal = () => {
  const sendSMSModal = useSendSMSModal();
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    if (sendSMSModal.isOpen) {
      setPhone(sendSMSModal.phone || "");
      setText("");
    }
  }, [sendSMSModal.isOpen, sendSMSModal.phone]);

  const onSubmit = async () => {
    if (!phone.trim()) {
      toast.error("شماره تلفن را وارد کنید");
      return;
    }

    if (!text.trim()) {
      toast.error("متن پیامک را وارد کنید");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/sms/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phone.trim(),
          text: text.trim(),
          schoolCode: sendSMSModal.schoolCode,
        }),
      });

      const result = await response
        .json()
        .catch(() => ({ message: "ارسال پیامک با خطا مواجه شد" }));

      if (!response.ok) {
        toast.error(result?.message || "ارسال پیامک با خطا مواجه شد");
        return;
      }

      toast.success(result?.message || "پیامک با موفقیت ارسال شد");
      sendSMSModal.onClose();
    } catch (error) {
      toast.error("ارسال پیامک با خطا مواجه شد");
    } finally {
      setIsLoading(false);
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      {sendSMSModal.label && (
        <div className="text-xs text-slate-500">{sendSMSModal.label}</div>
      )}
      <div className="flex flex-col gap-1">
        <label className="text-sm">شماره تلفن</label>
        <Input
          disabled={isLoading}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="مثال: 09123456789"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm">متن پیامک</label>
        <Textarea
          disabled={isLoading}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="متن پیام..."
          rows={5}
        />
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={sendSMSModal.isOpen}
      title="ارسال پیامک"
      actionLabel="ارسال"
      actionLabelVariant="default"
      secondaryActionLabel="انصراف"
      secondaryAction={sendSMSModal.onClose}
      onClose={sendSMSModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
      footer={<></>}
      description="شماره و متن پیام را وارد کنید"
    />
  );
};

const useSendSMSModal = create<SendSMSModalStore>((set) => ({
  isOpen: false,
  phone: "",
  schoolCode: undefined,
  label: undefined,
  onOpen: (payload) =>
    set({
      isOpen: true,
      phone: payload?.phone || "",
      schoolCode: payload?.schoolCode,
      label: payload?.label,
    }),
  onClose: () =>
    set({
      isOpen: false,
    }),
}));

export default useSendSMSModal;

