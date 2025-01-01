import { Locale } from "@/i18n-config";
import "@/app/[lang]/globals.css";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import localFont from "next/font/local";
import Providers from "@/app/[lang]/provider";
import { getDictionary } from "@/get-dictionary";
import { cn } from "@/lib/utils";
import SideBarMenu from "../../../../components/admin/SideBarMenu";
import AdminHeader from "../../../../components/admin/AdminHeader";
import { Separator } from "@/components/ui/separator";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Toaster } from "sonner";
const iransans = localFont({
  src: [
    // {
    //   path: "../../../../public/fonts/IRANSansWeb.eot",
    //   weight: "400",
    // },
    {
      path: "../../../../public/fonts/IRANSansWeb.ttf",
      weight: "400",
    },
    {
      path: "../../../../public/fonts/IRANSansWeb.woff",
      weight: "700",
    },
    {
      path: "../../../../public/fonts/IRANSansWeb.woff2",
      weight: "700",
    },
  ],
  variable: "--font-iransans",
});

// export const iransansBold = localFont({
//   src: [
//     // {
//     //   path: "../../../../public/fonts/IRANSansWeb.eot",
//     //   weight: "400",
//     // },
//     {
//       path: "../../../../public/fonts/IRANSansWeb_Bold.ttf",
//       weight: "400",
//     },
//     {
//       path: "../../../../public/fonts/IRANSansWeb_Bold.woff",
//       weight: "700",
//     },
//     {
//       path: "../../../../public/fonts/IRANSansWeb_Bold.woff2",
//       weight: "700",
//     },
//   ],
//   variable: "--font-iransansBold",
// });
export const metadata = {
  title: "ســـــامانه مـــــدیریت شـــــارژ",
  description: "ســـــامانه مـــــدیریت شـــــارژ",
};

// export async function generateStaticParams() {
//   return i18n.locales.map((locale) => ({ lang: locale }));
// }

export default async function Root({
  children,
  params,
}: // authModal,
{
  children: React.ReactNode;
  params: { lang: Locale };
  // authModal: React.ReactNode;
}) {
  // //console.log(params.lang);

  const dictionary = await getDictionary(params.lang);
  //const currentUser = await getCurrentUser();
  const currentUser = await getServerSession(authOptions);
  // //console.log("currentUser server>>", currentUser);
  if (!currentUser) redirect("/signin");
  //  //console.log("currentUser server>>", currentUser);
  return (
    <html
      suppressHydrationWarning
      lang={params.lang}
      dir={params.lang === "fa" ? "rtl" : "ltr"}
      // dir={(params.lang = "rtl")}
      className={cn("antialiased", iransans.className)}
    >
      {/* /${barlowCondensed.className} ${inter.className} ${merriweather.variable} ${roboto.className} ${iransans.className} font-sans/ */}
      {/* className={`${iransans.className}`}  */}
      {/* font-sans */}
      <body
        className={cn(
          " bg-gradient-to-r from-[#f1ece0] to-[#D6DDE2] dark:from-gray-800  dark:to-gray-800   antialiased"
          // iransans.variable,
          // fontMono.variable
        )}
      >
        <div
          className=" container   dark:bg-[#121415] overflow-hidden relative md:rounded-[30px]  mx-auto  bg-white md:mt-14 mb-52  h-auto
                      shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
        >
          <NextAuthProvider>
            <Toaster></Toaster>
            <Providers>
              {/* <Navbar
              navmenu={dictionary.navbar}
              siteLogo={dictionary.logo}
            ></Navbar> */}
              <div className="flex flex-row h-auto">
                <SideBarMenu cu={currentUser}></SideBarMenu>

                {/* <AdminDashboard></AdminDashboard> */}

                <div className="flex-grow flex  flex-col sm:mr-0 mx-2 sm:ml-4 mb-8 ">
                  <div className=" py-2 sm:py-6 flex justify-start items-center  ">
                    <AdminHeader cu={currentUser}></AdminHeader>
                  </div>
                  <Separator
                    orientation="horizontal"
                    className="mx-2 border-[.5px] border-slate-200 dark:border-slate-500"
                  />

                  {children}
                </div>
              </div>
            </Providers>
          </NextAuthProvider>
        </div>
      </body>
    </html>
  );
}
