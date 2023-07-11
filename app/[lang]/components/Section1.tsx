import TextSlider from "@/components/ui/textslider/TextSlider";
import Image from "next/image";
import React from "react";
import orange from "../../../public/images/grape.png";

type Props = {};

export default function Section1({}: Props) {
  return (
    <div className="z-50 relative flex flex-col lg:flex-row mx-8  h-[700px] lg:h-[450px] ">
      <div className="flex flex-col  flex-1">
        <div className="flex-1 grid-flow-row ">
          <Image
            className=" m-6 "
            src={orange}
            width={490}
            height={490}
            alt="Orange"
          ></Image>
        </div>

        <div className="mb-8  rtl:text-right text-red-600 dark:text-white ">
          {/* <div>
        <LocaleSwitcher />
        <p>Current locale: {lang}</p>
        <p>
          This text is rendered on the server:{" "}
          {dictionary["server-component"].welcome}
        </p>
        <Counter dictionary={dictionary.counter} />
      </div> */}
        </div>
      </div>
      <div className="flex flex-col  flex-1">
        {/* <TextSlider></TextSlider> */}

        {/* <div className="mb-8  rtl:text-right text-red-600 dark:text-white "></div> */}
      </div>
    </div>
  );
}
