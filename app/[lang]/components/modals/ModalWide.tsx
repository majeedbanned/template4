"use client";

import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { cva, type VariantProps } from "class-variance-authority";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Title } from "@radix-ui/react-dialog";
import LoadingDots from "@/components/loading/loading-dots";
interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  description?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string;
  hash: any;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
  actionLabelVariant:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}

const ModalWide: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  body,
  actionLabel,
  footer,
  disabled,
  hash,
  secondaryAction,
  secondaryActionLabel,
  actionLabelVariant,
}) => {
  const [showModal, setShowModal] = useState(isOpen);
  console.log("first", "https://ocr.persiangulfmall.com?page=" + hash.hash);
  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }

    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose, disabled]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }

    onSubmit();
  }, [onSubmit, disabled]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }

    secondaryAction();
  }, [secondaryAction, disabled]);

  if (!isOpen) {
    return null;
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="items-start fixed inset-0 bg-black bg-opacity-50 z-50">
        <DialogContent
          //     className=" items-start  sm:max-w-[1024px] bg-[#f9fafb] dark:bg-[#080909] dark:border-black dark:border-0 p-0
          //  overflow-y-scroll  rounded-3xl
          // "
          className=" flex-col flex items-center justify-center h-[90%]  sm:max-w-[1024px] bg-[#f9fafb] dark:bg-[#080909] dark:border-black dark:border-0 p-0 
      overflow-y-hidden rounded-3xl"
        >
          <DialogHeader className="bg-slate-50 dark:bg-[#2b2e31] p-2 rounded-t-3xl border-b-[1px] dark:border-0">
            {/* <DialogTitle className="flex justify-center">{title}</DialogTitle> */}
            <DialogDescription className="flex justify-center">
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="grid border w-full h-full px-2  gap-4 py-4">
            <iframe
              src={`https://ocr.persiangulfmall.com?page=${hash.hash}`}
              className="w-full h-full border-0 flex-1"
              title="Full Size iFrame"
            ></iframe>
            {/* {body} */}
          </div>

          {false && (
            <DialogFooter className="px-12">
              <div className="flex flex-1 flex-col gap-2 p-2 ">
                <div
                  className="
                    flex 
                    flex-row 
                    items-center 
                    gap-4 
                    w-full
                  "
                >
                  {secondaryAction && secondaryActionLabel && (
                    <Button
                      variant={"outline"}
                      className="flex flex-1 "
                      disabled={disabled}
                      onClick={handleSecondaryAction}
                    >
                      {" "}
                      {secondaryActionLabel}{" "}
                    </Button>
                  )}

                  <Button
                    variant={actionLabelVariant}
                    className="flex flex-1"
                    type="submit"
                    disabled={disabled}
                    onClick={handleSubmit}
                  >
                    {actionLabel}
                    {disabled && <LoadingDots color="#fff"></LoadingDots>}
                  </Button>
                </div>
                {footer}
              </div>
            </DialogFooter>
          )}
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
  return (
    <>
      <div
        className="
          justify-center 
          items-center 
          flex 
          overflow-x-hidden 
          overflow-y-auto 
          fixed 
          inset-0 
          z-50 
          outline-none 
          focus:outline-none
          bg-neutral-800/70
        "
      >
        <div
          className="
          relative 
          w-full
          md:w-4/6
          lg:w-3/6
          xl:w-2/5
          my-6
          mx-auto 
          h-full 
          lg:h-auto
          md:h-auto
          "
        >
          {/*content*/}
          <div
            className={`
            translate
            duration-300
            h-full
            ${showModal ? "translate-y-0" : "translate-y-full"}
            ${showModal ? "opacity-100" : "opacity-0"}
          `}
          >
            <div
              className="
              translate
              h-full
              lg:h-auto
              md:h-auto
              border-0 
              rounded-lg 
              shadow-lg 
              relative 
              flex 
              flex-col 
              w-full 
              bg-white 
              outline-none 
              focus:outline-none
            "
            >
              {/*header*/}
              <div
                className="
                flex 
                items-center 
                p-6
                rounded-t
                justify-center
                relative
                border-b-[1px]
                "
              >
                <button
                  className="
                    p-1
                    border-0 
                    hover:opacity-70
                    transition
                    absolute
                    left-9
                  "
                  onClick={handleClose}
                >
                  <IoMdClose size={18} />
                </button>
                <div className="text-lg font-semibold">{title}</div>
              </div>
              {/*body*/}
              <div className="relative p-6 flex-auto">{body}</div>
              {/*footer*/}
              <div className="flex flex-col gap-2 p-6">
                <div
                  className="
                    flex 
                    flex-row 
                    items-center 
                    gap-4 
                    w-full
                  "
                >
                  {secondaryAction && secondaryActionLabel && (
                    <Button disabled={disabled} onClick={handleSecondaryAction}>
                      {" "}
                      {secondaryActionLabel}{" "}
                    </Button>
                  )}
                  <Button disabled={disabled} onClick={handleSubmit}>
                    {actionLabel}
                  </Button>
                </div>
                {footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalWide;
