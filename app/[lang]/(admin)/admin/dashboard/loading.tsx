import ThreeDots from "@/components/admin/ui/three-dots";
import React from "react";

type Props = {};

export default function loading({}: Props) {
  return (
    <div className="flex mt-12  justify-center items-center ">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ margin: "auto", background: "#fff" }}
        width="64"
        height="64"
        display="block"
        preserveAspectRatio="xMidYMid"
        viewBox="0 0 100 100"
      >
        <rect width="36" height="36" x="9" y="9" fill="#8ba5e2" rx="6" ry="6">
          <animate
            attributeName="x"
            begin="-2.7777777777777777s"
            dur="3.0303030303030303s"
            keyTimes="0;0.083;0.25;0.333;0.5;0.583;0.75;0.833;1"
            repeatCount="indefinite"
            values="9;55;55;55;55;9;9;9;9"
          ></animate>
          <animate
            attributeName="y"
            begin="-2.02020202020202s"
            dur="3.0303030303030303s"
            keyTimes="0;0.083;0.25;0.333;0.5;0.583;0.75;0.833;1"
            repeatCount="indefinite"
            values="9;55;55;55;55;9;9;9;9"
          ></animate>
        </rect>
        <rect width="36" height="36" x="9" y="9" fill="#ff9901" rx="6" ry="6">
          <animate
            attributeName="x"
            begin="-1.7676767676767677s"
            dur="3.0303030303030303s"
            keyTimes="0;0.083;0.25;0.333;0.5;0.583;0.75;0.833;1"
            repeatCount="indefinite"
            values="9;55;55;55;55;9;9;9;9"
          ></animate>
          <animate
            attributeName="y"
            begin="-1.01010101010101s"
            dur="3.0303030303030303s"
            keyTimes="0;0.083;0.25;0.333;0.5;0.583;0.75;0.833;1"
            repeatCount="indefinite"
            values="9;55;55;55;55;9;9;9;9"
          ></animate>
        </rect>
        <rect width="36" height="36" x="9" y="9" fill="#c8e443" rx="6" ry="6">
          <animate
            attributeName="x"
            begin="-0.7575757575757576s"
            dur="3.0303030303030303s"
            keyTimes="0;0.083;0.25;0.333;0.5;0.583;0.75;0.833;1"
            repeatCount="indefinite"
            values="9;55;55;55;55;9;9;9;9"
          ></animate>
          <animate
            attributeName="y"
            begin="0s"
            dur="3.0303030303030303s"
            keyTimes="0;0.083;0.25;0.333;0.5;0.583;0.75;0.833;1"
            repeatCount="indefinite"
            values="9;55;55;55;55;9;9;9;9"
          ></animate>
        </rect>
      </svg>
      لطفا منتظر بمانید
      <ThreeDots className=""></ThreeDots>
    </div>
  );
}
