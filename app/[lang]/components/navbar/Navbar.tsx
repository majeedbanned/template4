"use client";
import React, { useEffect, useState } from "react";
import SiteLogo from "../SiteLogo";
import NavMenu from "../NavMenu";
import Profile from "../../Profile";

type Props = {};

export default function Navbar({
  navmenu,
  siteLogo,
  className,
}: {
  siteLogo: { maintitle: string; subtitle: string };
  navmenu: {
    home: string;
    aboutus: string;
    contactus: string;
    pricing: string;
    services: string;
  };
  className: React.HtmlHTMLAttributes<HTMLDivElement>;
}) {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const handleSchroll = () => {
      setSticky(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleSchroll);

    return () => {
      window.removeEventListener("scroll", handleSchroll);
    };
  });

  return (
    <div
      className={`z-20 justify-between  items-center  ${
        sticky
          ? "fixed top-0 bg-white mt-0 z-[999] shadow-md w-auto inset-1  h-16"
          : "relative mt-8 ml-6 mr-4"
      }      flex`}
    >
      <div className="  flex">
        <SiteLogo dictionary={siteLogo}></SiteLogo>
      </div>
      <div className="   flex grow   flex-row items-center justify-end rtl:justify-start px-4">
        <NavMenu dictionary={navmenu} />
      </div>
      <div className="flex  ">
        <Profile></Profile>
      </div>
    </div>
  );
}
