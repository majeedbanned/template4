"use client";
import { getfish, getfish1 } from "@/actions/actions";
import LoadingDots from "@/components/loading/loading-dots";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
type Props = {};

export default function Form({}: Props) {
  const [ret, setRet] = useState({});
  const [value, setValue] = React.useState("france");
  let [pending, startTransition] = useTransition();
  const onclick = () => {
    getfish1("hi hi hi").then((data) => setRet(data));
  };
  return (
    // <form action={getfish}>
    //   <Input name="month"></Input>
    //   <Button variant={"default"}> Get Fich </Button>
    // </form>

    <div>
      <div className="flex flex-row gap-2 justify-center items-center">
        <p>صدور قبض شارژ گروهی برای دوره :</p>
        <Select onValueChange={setValue} defaultValue="1402-06">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="دوره را انتخاب کنید" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {/* <SelectLabel>Fruits</SelectLabel> */}

              <SelectItem value="1402-06">1402-06</SelectItem>
              <SelectItem value="1402-07">1402-07</SelectItem>
              <SelectItem value="1402-08">1402-08</SelectItem>
              <SelectItem value="1402-09">1402-09</SelectItem>
              <SelectItem value="1402-10">1402-10</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          disabled={pending}
          variant={"outline"}
          onClick={async () => {
            startTransition(async () => {
              const ret = await getfish1(value);
              setRet(ret);
            });
          }}

          /// onClick={onclick}
        >
          <div className="flex gap-2">
            <p>صدور قبض</p>
            {pending && <LoadingDots color="#000"></LoadingDots>}
          </div>
        </Button>
      </div>

      <p>{JSON.stringify(ret)}</p>
    </div>
  );
}
