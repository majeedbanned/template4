import React from "react";
import { Myform } from "./Myform";

type Props = {};

export default function page({}: Props) {
  // write fetch here
  const resposce = { jooon: "test", age: "125" };
  return (
    <div>
      <Myform datar={resposce}></Myform>
    </div>
  );
}
