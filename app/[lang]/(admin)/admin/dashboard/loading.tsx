import ThreeDots from "@/components/admin/ui/three-dots";
import React from "react";

type Props = {};

export default function loading({}: Props) {
  return (
    <div className="flex justify-center items-center ">
      Please Wait...
      <ThreeDots className=""></ThreeDots>
    </div>
  );
}
