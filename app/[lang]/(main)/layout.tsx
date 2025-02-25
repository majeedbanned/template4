import { Locale, i18n } from "../../../i18n-config";
import Image from "next/image";
import "./../globals.css";
import ellipse from "@/svg/ellipse.svg";
import localFont from "next/font/local";
import Providers from "../provider";
import Navbar from "../components/navbar/Navbar";
import { getDictionary } from "@/get-dictionary";
import { cn } from "@/lib/utils";
import ClientOnly from "@/lib/ClientOnly";

const iransans = localFont({
  src: [
    // {
    //   path: "../../public/fonts/IRANSansWeb.eot",
    //   weight: "400",
    // },
    {
      path: "../../../public/fonts/IRANSansWeb.ttf",
      weight: "400",
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
export const metadata = {
  title: "ســـــامانه مـــــدیریت شـــــارژ",
  description: "ســـــامانه مـــــدیریت شـــــارژ",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function Root({
  children,
  params,
}: // authModal,
{
  children: React.ReactNode;
  params: { lang: Locale };
  //authModal: React.ReactNode;
}) {
  // //console.log(params.lang);

  const dictionary = await getDictionary(params.lang);

  return (
    <html
      lang={params.lang}
      dir={params.lang === "fa" ? "rtl" : "ltr"}
      className={cn("antialiased", iransans.className)}
    >
      {/* /${barlowCondensed.className} ${inter.className} ${merriweather.variable} ${roboto.className} ${iransans.className} font-sans/ */}
      {/* className={`${iransans.className}`}  */}
      <body className="antialiased">
        {/* <div className="  "> */}
        {/* <ClientOnly> */}
        <Providers>
          <div
            className=" container  dark:bg-slate-900 overflow-hidden relative md:rounded-2xl  mx-auto  bg-white md:mt-14 mb-52  h-full
                      shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
          >
            {/* {authModal} */}
            <Image
              className="z-10 absolute -top-44 -left-44"
              alt="Picture of the author"
              src={ellipse}
            ></Image>

            <Navbar
              navmenu={dictionary.navbar}
              siteLogo={dictionary.logo}
            ></Navbar>

            {children}
          </div>
        </Providers>

        {/* </div> */}
        {/* </ClientOnly> */}
      </body>
    </html>
  );
}
