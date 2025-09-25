"use client";
import { getfish, getfish1 } from "@/actions/actions";
import LoadingDots from "@/components/loading/loading-dots";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const [value, setValue] = React.useState("1402-06");
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
      {/* <p>{JSON.stringify(ret)}</p> */}

      <Card>
        <CardHeader>
          <CardTitle>قبض شارژ</CardTitle>
          {/* <CardDescription>Card Description</CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="flex flex-row gap-2 justify-start items-center">
            <p>صدور قبض شارژ گروهی برای دوره :</p>
            <Select onValueChange={setValue} defaultValue="1402-06">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="دوره را انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {/* <SelectLabel>Fruits</SelectLabel> */}

                  <SelectItem value="1404-01">1404-01</SelectItem>
                  <SelectItem value="1404-02">1404-02</SelectItem>
                  <SelectItem value="1404-03">1404-03</SelectItem>
                  <SelectItem value="1404-04">1404-04</SelectItem>
                  <SelectItem value="1404-05">1404-05</SelectItem>
                  <SelectItem value="1404-06">1404-06</SelectItem>
                  <SelectItem value="1404-07">1404-07</SelectItem>
                  <SelectItem value="1404-08">1404-08</SelectItem>
                  <SelectItem value="1404-09">1404-09</SelectItem>
                  <SelectItem value="1404-10">1404-10</SelectItem>
                  <SelectItem value="1404-11">1404-11</SelectItem>
                  <SelectItem value="1404-12">1404-12</SelectItem>

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
        </CardContent>
        <CardFooter>
          <p>
            {
              //@ts-ignore
              ret.issued !== undefined &&
                //@ts-ignore

                ret.issued + " قبض شارژ صادر شد."
            }
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
