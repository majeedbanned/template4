import { Locale, i18n } from "@/i18n-config";
import Image from "next/image";
import "@/app/[lang]/globals.css";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import ellipse from "@/svg/ellipse.svg";
import localFont from "next/font/local";
import Providers from "@/app/[lang]/provider";
import Navbar from "@/app/[lang]/components/navbar/Navbar";
import { getDictionary } from "@/get-dictionary";
import { cn } from "@/lib/utils";
import Sidebar, { SidebarItem } from "../../components/sidebar/Sidebar";
import { TvIcon } from "@heroicons/react/24/outline";
import { BanIcon } from "lucide-react";
import SideBarMenu from "../../../../components/admin/SideBarMenu";
import AdminDashboard from "../../../../components/admin/AdminDashboard";
import AdminHeader from "../../../../components/admin/AdminHeader";
import { fontMono, fontSans } from "@/lib/fonts";
import { Separator } from "@/components/ui/separator";
import { AnimatePresence } from "framer-motion";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Toaster } from "sonner";
const iransans = localFont({
  src: [
    // {
    //   path: "../../public/fonts/IRANSansWeb.eot",
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
export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

// export async function generateStaticParams() {
//   return i18n.locales.map((locale) => ({ lang: locale }));
// }

export default async function Root({
  children,
  params,
  authModal,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
  authModal: React.ReactNode;
}) {
  // console.log(params.lang);

  const dictionary = await getDictionary(params.lang);
  //const currentUser = await getCurrentUser();
  const currentUser = await getServerSession(authOptions);
  console.log("currentUser server>>", currentUser);
  if (!currentUser) redirect("/signin");
  console.log("currentUser server>>", currentUser);
  return (
    <html
      suppressHydrationWarning
      lang={params.lang}
      dir={params.lang === "ar" ? "rtl" : "ltr"}
      // dir={(params.lang = "rtl")}
      className={cn("antialiased", iransans.className)}
    >
      {/* /${barlowCondensed.className} ${inter.className} ${merriweather.variable} ${roboto.className} ${iransans.className} font-sans/ */}
      {/* className={`${iransans.className}`}  */}
      <body
        className={cn(
          " bg-gradient-to-r from-[#f1ece0] to-[#D6DDE2] dark:from-gray-800  dark:to-gray-800  font-sans antialiased",
          fontSans.variable,
          fontMono.variable
        )}
      >
        <div
          className=" container  dark:bg-[#121415] overflow-hidden relative md:rounded-[30px]  mx-auto  bg-white md:mt-14 mb-52  h-auto
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
                <SideBarMenu></SideBarMenu>

                {/* <AdminDashboard></AdminDashboard> */}

                <div className="flex-grow flex  flex-col sm:mr-8 mx-2 sm:ml-4 mb-8 ">
                  <div className=" py-2 sm:py-8 flex justify-start items-center  ">
                    <AdminHeader></AdminHeader>
                  </div>
                  <Separator
                    orientation="horizontal"
                    className="mx-2 text-white"
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
