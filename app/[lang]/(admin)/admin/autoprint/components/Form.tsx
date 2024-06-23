"use client";
import {
  getGroupPrint,
  getNov,
  getRahro,
  getfish,
  getfish1,
} from "@/actions/actions";
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
  const [rahrov, setNrahrov] = React.useState("");

  const [vaziat, setVaziat] = React.useState("");

  const [rahrovalue, setRahroValue] = React.useState<any>([]);

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
    getRahro().then((data) => setRahroValue(data));
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
            <div className="flex flex-col gap-2">
              <p> دوره : </p>

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
                    <SelectItem value="1403-01">1403-01</SelectItem>
                    <SelectItem value="1403-02">1403-02</SelectItem>
                    <SelectItem value="1403-03">1403-03</SelectItem>
                    <SelectItem value="1403-04">1403-04</SelectItem>
                    <SelectItem value="1403-05">1403-05</SelectItem>
                    <SelectItem value="1403-06">1403-06</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p> نوع : </p>
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
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p> تجاری : </p>
              <Select onValueChange={setNrahrov} defaultValue="">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="دوره را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* <SelectLabel>Fruits</SelectLabel> */}
                    <SelectItem value="">لطفا انتخاب کنید</SelectItem>

                    {rahrovalue?.map((item: any) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.tabagh}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p> وضعیت : </p>
              <Select onValueChange={setVaziat} defaultValue="">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="دوره را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="">لطفا انتخاب کنید</SelectItem>

                    <SelectItem value="True">فعال</SelectItem>
                    <SelectItem value="False">غیر فعال</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                disabled={pending}
                variant={"secondary"}
                onClick={async () => {
                  console.log(vaziat);

                  startTransition(async () => {
                    const ret = await getGroupPrint(
                      value,
                      novvalue,
                      "",
                      rahrov,
                      vaziat
                    );
                    console.log(ret.length);
                    setPrintData(ret);

                    setTimeout(() => {
                      handlePrint();
                    }, 5000);
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
          </div>
        </CardContent>
        <CardFooter>{/* <p>Card Footer</p> */}</CardFooter>
      </Card>
    </div>
  );
}
