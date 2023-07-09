"use client";

import { cn } from "@/lib/utils";
// import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";

export const PageWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    className={cn("", className)}
  >
    {children}
  </motion.div>
);
