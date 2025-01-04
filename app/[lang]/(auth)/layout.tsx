import { cn } from "@/lib/utils";
import "./../globals.css";
import localFont from "next/font/local";
import logo from "@/public/images/logofull.png";
import Image from "next/image";

export const metadata = {
  title: "ســـــامانه مـــــدیریت شـــــارژ",
  description: "ســـــامانه مـــــدیریت شـــــارژ",
};

const iransans = localFont({
  src: [
    // {
    //   path: "../../../../public/fonts/IRANSansWeb.eot",
    //   weight: "400",
    // },
    {
      path: "../../../public/fonts/IRANSansWeb.ttf",
      weight: "800",
    },
    {
      path: "../../../public/fonts/IRANSansWeb.woff",
      weight: "700",
    },
    {
      path: "../../../public/fonts/IRANSansWeb.woff2",
      weight: "700",
    },
  ],
  variable: "--font-iransans",
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("antialiased", iransans.className)}>
      <body className=" ">
        <div className=" flex flex-row bg-[#dae7fa]">
          <div className="flex flex-1"> </div>

          <div className="relative overflow-hidden  h-screen flex flex-[.8] bg-gradient-to-r from-[#007aff] to-[#0a79f7]  ">
            {/* circle */}
            <div className="absolute flex justify-center items-center z-10 -left-[200px] top-[30px] border-[#2d8ff0] h-[800px] w-[800px] border rounded-full">
              <div className=" z-10   border-[#0e82f3] h-[550px] w-[550px] border rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="shadow-lg flex border border-white/10 absolute lg:mx-36 sm:rounded-[55px] sm:my-20 bg-white/20 m-auto top-0 right-0 left-0 bottom-0">
          <div className="shadow-sm m-3 flex flex-row flex-1 max-h-max sm:rounded-[45px] bg-gradient-to-r from-[#065bbb] to-[#008dff]">
            <div className="flex z-40 lg:flex-[1.3] flex-[1.6] px-4 sm:rounded-r-[45px] m-0 justify-center items-center sm:rounded-l-[45px] shadow-sm bg-white">
              <div className=" flex-col gap-4 justify-center items-center flex ">
                <div className="flex-col gap-4 justify-center items-center flex sm:hidden">
                  <Image
                    // className={`overflow-hidden transition-all ${
                    //   expanded ? "w-44" : "w-0"
                    // }`}
                    src={logo}
                    width={200}
                    height={200}
                    alt=""
                  ></Image>
                  <p className="text-lg font-extralight text-blue-400">
                    ســـــامانه مـــــدیریت شـــــارژ
                  </p>
                </div>
                {children}
              </div>
            </div>
            <div className="flex flex-col lg:flex-[.751] flex-[.3] items-center justify-center  bg-transparent">
              <div className=" flex-col hidden sm:inline-flex">
                <Image
                  // className={`overflow-hidden transition-all ${
                  //   expanded ? "w-44" : "w-0"
                  // }`}
                  src={logo}
                  width={280}
                  height={280}
                  alt=""
                ></Image>
                <p className="text-lg font-extralight text-blue-300">
                  ســـــامانه مـــــدیریت شـــــارژ
                </p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
