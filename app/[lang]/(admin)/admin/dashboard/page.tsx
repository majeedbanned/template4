import React from "react";

type Props = {};

export default function Dashboard({}: Props) {
  return (
    <>
      <div className=" p-4 h-48 ">header2</div>

      <div className=" flex-grow h-auto flex-col rounded-[25px] bg-[#eef2f5]  justify-center items-start ">
        <div className=" p-4 mx-8 my-4 flex justify-start items-center border-b ">
          header
        </div>
        <div className=" mx-8  flex-grow  justify-start items-center ">
          <div className=" grid grid-cols-3 gap-4 grid-flow-row">
            <div className=" flex rounded-2xl shadow-md justify-center items-center  h-[250px] bg-white">
              000
            </div>
            <div className=" flex rounded-2xl shadow-md justify-center items-center  h-[250px] bg-white">
              000
            </div>
            <div className=" flex rounded-2xl shadow-md justify-center items-center  h-[250px] bg-white">
              000
            </div>
            <div className=" flex rounded-2xl shadow-md justify-center items-center  h-[250px] bg-white">
              000
            </div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
}
