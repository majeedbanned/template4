"use client";

import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialogtall";
import { Title } from "@radix-ui/react-dialog";
import ThreeDots from "@/components/admin/ui/three-dots";
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
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}

const Modaltall: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  body,
  actionLabel,
  footer,
  disabled,
  secondaryAction,
  secondaryActionLabel,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

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
      <DialogOverlay className="items-start">
        <DialogContent
          className=" items-start sm:max-w-[425px] bg-[#f9fafb] dark:bg-[#080909] dark:border-black dark:border-0 p-0 
       overflow-y-scroll 
      "
        >
          <DialogHeader className="bg-white dark:bg-[#2b2e31] p-8 rounded-t-3xl border-b-[1px] dark:border-0">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="grid  px-12  gap-4 py-4">{body}</div>

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

export default Modaltall;
