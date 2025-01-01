import TextSlider from "@/components/ui/textslider/TextSlider";
import { getDictionary } from "../../../get-dictionary";
import { Locale } from "../../../i18n-config";
import Counter from "../components/counter";
import LocaleSwitcher from "../components/locale-switcher";
import orange from "../../public/images/grape.png";
import Image from "next/image";
import Section1 from "../components/Section1";
import Section3 from "../components/Section3";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";

export default async function IndexPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  const currentUser = await getServerSession(authOptions);
  ////console.log("currentUser server>>", currentUser);
  if (!currentUser) redirect("/signin");
  else redirect("/admin/main");

  return (
    <div className="z-50 relative flex flex-col  ">
      <Section1></Section1>
      {/* <Section3></Section3> */}
      <br />
      <br />
      <br />
      fn
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}
