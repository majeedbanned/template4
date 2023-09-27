"use client";
import { getGroupPrint, getNov, getfish, getfish1 } from "@/actions/actions";
import LoadingDots from "@/components/loading/loading-dots";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useRef, useState, useTransition } from "react";
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
import ComponentToPrint from "@/app/[lang]/components/prints/groupfish";
import { useReactToPrint } from "react-to-print";
type Props = {};

export default function Form({}: Props) {
  const [ret, setRet] = useState({});
  const [nov, setNov] = useState<any>([]);
  const [printData, setPrintData] = useState<any>([]);

  const [value, setValue] = React.useState("1402-06");
  const [novvalue, setNovValue] = React.useState("1");

  let [pending, startTransition] = useTransition();
  // const onclick = () => {
  //   getfish1("hi hi hi").then((data) => setRet(data));
  // };

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "AwesomeFileName",
  });

  useEffect(() => {
    getNov().then((data) => setNov(data));
  }, []);

  return (
    // <form action={getfish}>
    //   <Input name="month"></Input>
    //   <Button variant={"default"}> Get Fich </Button>
    // </form>

    <div>
      <ComponentToPrint
        data={printData}
        // chargeDef={printChargeDef}
        // store={printStore}
        ref={componentRef}
      />

      {/* <p>{JSON.stringify(ret)}</p> */}
      <p>
        {
          //@ts-ignore
          ret.issued !== undefined &&
            //@ts-ignore

            ret.issued + " قبض شارژ صادر شد."
        }
      </p>

      <Card>
        <CardHeader>
          <CardTitle> چاپ قبض</CardTitle>
          {/* <CardDescription>Card Description</CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="flex flex-row gap-2 justify-start items-center">
            <p>چاپ قبض شارژ گروهی برای دوره :</p>
            <Select onValueChange={setValue} defaultValue="1402-06">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="دوره را انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {/* <SelectLabel>Fruits</SelectLabel> */}
                  <SelectItem value="1402-05">1402-05</SelectItem>

                  <SelectItem value="1402-06">1402-06</SelectItem>
                  <SelectItem value="1402-07">1402-07</SelectItem>
                  <SelectItem value="1402-08">1402-08</SelectItem>
                  <SelectItem value="1402-09">1402-09</SelectItem>
                  <SelectItem value="1402-10">1402-10</SelectItem>
                  <SelectItem value="1402-11">1402-11</SelectItem>
                  <SelectItem value="1402-12">1402-12</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <p> تجاری : </p>
            <Select onValueChange={setNovValue} defaultValue="1">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="دوره را انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {/* <SelectLabel>Fruits</SelectLabel> */}
                  {nov?.map((item: any) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.nov}
                    </SelectItem>
                  ))}
                  {/* <SelectItem value="1402-06">1402-06</SelectItem>
              <SelectItem value="1402-07">1402-07</SelectItem>
              <SelectItem value="1402-08">1402-08</SelectItem>
              <SelectItem value="1402-09">1402-09</SelectItem>
              <SelectItem value="1402-10">1402-10</SelectItem>
              <SelectItem value="1402-11">1402-11</SelectItem>
              <SelectItem value="1402-12">1402-12</SelectItem> */}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              disabled={pending}
              variant={"outline"}
              onClick={async () => {
                startTransition(async () => {
                  const ret = await getGroupPrint(value, novvalue, "");
                  console.log(ret);
                  setPrintData(ret);

                  setTimeout(() => {
                    handlePrint();
                  }, 100);
                });
              }}

              /// onClick={onclick}
            >
              <div className="flex gap-2">
                <p> چاپ</p>
                {pending && <LoadingDots color="#000"></LoadingDots>}
              </div>
            </Button>
          </div>
        </CardContent>
        <CardFooter>{/* <p>Card Footer</p> */}</CardFooter>
      </Card>
    </div>
  );
}
