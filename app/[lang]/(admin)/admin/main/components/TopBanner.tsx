"use client";
import { HomeIcon } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
type Props = {};

export default function TopBanner({}: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-row gap-8 ">
        <motion.div
          key={1}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="relative h-[100px] w-[220px] overflow-hidden bg-gradient-to-b from-[#fb8b86] shadow-lg shadow-[#fead92]/50 to-[#fead92] rounded-tr-[55px]
    rounded-xl
    "
        >
          <div
            className="absolute bottom-1 right-1 w-[70px] h-[70px] rounded-l-3xl 
        rounded-tl-[105px] 
        rounded-tr-[85px]
        rounded-br-[115px]
        rounded-bl-[95px]


         bg-white/40"
          ></div>

          <div className="w-[120px] h-[120px] absolute -left-14 -top-14  rounded-full bg-white/40"></div>
          <HomeIcon className="text-white w-12 h-12  absolute left-0 bg-transparent"></HomeIcon>
        </motion.div>

        <motion.div
          key={1}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative h-[100px] w-[220px] overflow-hidden bg-gradient-to-b from-[#6d7fe5] shadow-lg shadow-[#6d7fe5]/50 to-[#6066de] rounded-tr-[55px]
    rounded-xl
    "
        >
          <div className="w-[120px] h-[120px] absolute -left-14 -top-14  rounded-full bg-white/40"></div>
          <HomeIcon className="text-white w-12 h-12  absolute left-0 bg-transparent"></HomeIcon>
        </motion.div>

        <motion.div
          key={2}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative h-[100px] w-[220px] overflow-hidden bg-gradient-to-b from-[#fd83aa] shadow-lg shadow-[#fd83aa]/50 to-[#ff548a] rounded-tr-[55px]
    rounded-xl
    "
        >
          <div className="w-[120px] h-[120px] absolute -left-14 -top-14  rounded-full bg-white/40"></div>
          <HomeIcon className="text-white w-12 h-12  absolute left-0 bg-transparent"></HomeIcon>
        </motion.div>

        <motion.div
          key={1}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative h-[100px] w-[220px] overflow-hidden bg-gradient-to-b from-[#45a6e6] shadow-lg shadow-[#45a6e6]/50 to-[#1d8fdb] rounded-tr-[55px]
    rounded-xl
    "
        >
          <div className="w-[120px] h-[120px] absolute -left-14 -top-14  rounded-full bg-white/40"></div>
          <HomeIcon className="text-white w-12 h-12  absolute left-0 bg-transparent"></HomeIcon>
        </motion.div>
      </div>

      <div className="flex flex-row gap-4">
        {/* <div className="w-[170px] h-[200px] rounded-3xl shadow-slate-200 shadow-lg flex justify-center flex-col gap-4 items-center">
          <div
            className=" w-[90px] h-[90px] rounded-l-3xl bg-[#fff8ec]
                  rounded-tl-[125px] 
                  rounded-tr-[165px]
                 rounded-br-[135px]
                 rounded-bl-[115px]
                 flex justify-center items-center
        "
          >
            <AcademicCapIcon className="w-10 h-10 text-[#ffb52c]"></AcademicCapIcon>
          </div>
          <span className="text-[#ffa600]">اطلاعات واحد</span>
        </div> */}

        <div className="w-[170px] h-[200px] rounded-3xl shadow-slate-200 shadow-lg flex justify-center flex-col gap-4 items-center">
          <div
            className=" w-[90px] h-[90px] rounded-l-3xl bg-[#ecefff]
                  rounded-tl-[105px] 
                  rounded-tr-[155px]
                 rounded-br-[115px]
                 rounded-bl-[135px]
                 flex justify-center items-center
        "
          >
            <AcademicCapIcon className="w-10 h-10 text-[#6541f6]"></AcademicCapIcon>
          </div>

          <span className="text-[#6541f6]">اطلاعات واحد</span>
        </div>

        <a className="card human-resources" href="#">
          <div className="overlay"></div>
          <div className="circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="66"
              height="77"
              viewBox="1855 26 66 77"
            >
              <g
                fill="none"
                fillRule="evenodd"
                stroke="none"
                strokeWidth="1"
                transform="translate(1855 26)"
              >
                <path
                  fill="#AFCEFF"
                  d="M4.289 42.746c0-3.415 1.127-8.984 2.117-12.255 4.186 1.619 7.896 4.63 12.29 4.63 12.298 0 23.88-6.405 31.303-17.22 6.804 5.987 10.82 15.145 10.82 24.845 0 18.071-13.209 33.923-28.265 33.923-15.057 0-28.265-15.852-28.265-33.923"
                ></path>
                <path
                  fill="#3B6CB7"
                  d="M64.337 31.183l-1.495 15.42-2.199.18-.809-12.104-12.177-9.345C44.291 34.068 34.346 40.29 24.468 40.29c-6.712 0-14.422-2.873-18.663-7.49v13.803H4.289L1.302 27.88c0-6.9 2.221-12.337 5.97-16.522C13.132 4.796 21.812.049 30.567.343c6.893.226 12.1 2.387 20.263 0 .633 1.101 1.032 2.662.757 4.882-.124 1.658-.376 2.298-.757 3.226 7.856 5.747 13.507 12.256 13.507 22.732"
                ></path>
                <path
                  fill="#568ADC"
                  d="M58.94 54.558c3.134.269 6.42-1.957 6.695-5.02a5.494 5.494 0 00-1.317-4.08 5.714 5.714 0 00-3.865-1.976L58.94 54.558z"
                ></path>
                <path
                  fill="#568ADC"
                  d="M6.324 54.675c-3.142.174-5.84-2.18-6.017-5.249a5.501 5.501 0 011.445-4.037 5.716 5.716 0 013.927-1.859l.645 11.145z"
                ></path>
              </g>
            </svg>
          </div>
          <p>Human Resources</p>
        </a>

        <a className="card credentialing" href="#">
          <div className="overlay"></div>
          <div className="circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="64"
              height="72"
              viewBox="27 21 64 72"
            >
              <defs>
                <path d="M60.9784821 18.4748913L60.9784821 0.0299638385 0.538377293 0.0299638385 0.538377293 18.4748913z"></path>
              </defs>
              <g
                fill="none"
                fillRule="evenodd"
                stroke="none"
                strokeWidth="1"
                transform="translate(27 21)"
              >
                <g>
                  <g transform="translate(2.262 21.615)">
                    <path
                      fill="#59A785"
                      d="M7.178 18.475h47.16c3.653 0 6.641-2.748 6.641-6.107V6.137c0-3.359-2.988-6.107-6.64-6.107H7.178C3.526.03.538 2.778.538 6.137v6.231c0 3.359 2.988 6.107 6.64 6.107"
                      mask="url(#mask-2)"
                    ></path>
                  </g>
                  <path
                    fill="#FFF"
                    d="M62.0618351 55.9613216L7.2111488 60.3692832 1.50838775 5.79374073 56.3582257 1.38577917z"
                    transform="rotate(-2 31.785 30.878)"
                  ></path>
                  <ellipse
                    cx="30.058"
                    cy="21.766"
                    fill="#25D48A"
                    opacity="0.216"
                    rx="9.952"
                    ry="9.173"
                  ></ellipse>
                  <g fill="#54C796" transform="translate(16.96 6.48)">
                    <path d="M10.7955395 21.7823628L0.11873799 11.3001058 4.25482787 7.73131106 11.0226557 14.3753897 27.414824 1.77635684e-15 31.3261391 3.77891399z"></path>
                  </g>
                  <path
                    fill="#59B08B"
                    d="M4.823 67.437h56.395c1.112 0 2.023-.837 2.023-1.86v-34.19c0-1.023-.91-1.86-2.023-1.86H4.823c-1.112 0-2.022.837-2.022 1.86v34.19c0 1.023.91 1.86 2.022 1.86"
                  ></path>
                  <path
                    fill="#4FC391"
                    d="M33.334 67.437h27.884c1.112 0 2.023-.837 2.023-1.86v-34.19c0-1.023-.91-1.86-2.023-1.86H33.334c-1.112 0-2.023.837-2.023 1.86v34.19c0 1.023.91 1.86 2.023 1.86"
                  ></path>
                  <path
                    fill="#FEFEFE"
                    d="M29.428 33.264c0 .956.843 1.731 1.883 1.731s1.882-.775 1.882-1.73c0-.957-.843-1.732-1.882-1.732-1.04 0-1.883.775-1.883 1.731"
                  ></path>
                  <path
                    fill="#5BD6A2"
                    d="M8.454 71.555h49.134c3.109 0 5.653-2.34 5.653-5.2 0-2.86-2.544-5.2-5.653-5.2H8.454c-3.11 0-5.653 2.34-5.653 5.2 0 2.86 2.544 5.2 5.653 5.2"
                  ></path>
                </g>
              </g>
            </svg>
          </div>
          <p>Credentialing</p>
        </a>

        <div className="card wallet">
          <div className="overlay"></div>
          <div className="circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
              viewBox="0 0 1024 1024"
              width="66"
              height="77"
            >
              <g fill="#b38bf4">
                <path d="M278.343 471.64h141.91v141.91h-141.91zm525.653 81.767c-34.647-35.794-91.922-36.725-127.687-2.079-17.333 16.779-27.093 39.3-27.479 63.413-.283 17.183 4.415 33.617 13.095 47.967l-29.31 28.373-25.716-26.568c-7.79-8.048-20.64-8.246-28.668-.475-8.048 7.79-8.256 20.629-.475 28.668l25.726 26.575-19.206 18.592-41.66-43.03c-7.781-8.048-20.62-8.237-28.669-.456-8.037 7.78-8.245 20.619-.455 28.668l41.65 43.018-12.172 11.782c-8.047 7.79-8.255 20.63-.475 28.668a20.235 20.235 0 0014.571 6.177 20.222 20.222 0 0014.096-5.702l26.741-25.886c.005-.005.011-.005.016-.01.005-.005.005-.01.01-.015l48.309-46.76.008-.007.006-.008 43.876-42.474c14.063 9.144 30.336 14.375 47.524 14.657.495.01 1 .01 1.505.01 23.56 0 45.792-8.997 62.76-25.42 17.333-16.778 27.092-39.298 27.478-63.412.398-24.116-8.62-46.943-25.4-64.266z"></path>
                <path d="M927.079 664.235c0-73.157-31.346-138.975-81.092-185.274v-64.864l47.763 40.222a20.2 20.2 0 0013.046 4.761 20.259 20.259 0 0015.52-7.216c7.207-8.563 6.108-21.352-2.454-28.568L560.928 121.03c-22.836-19.233-55.869-19.154-78.567.179L339.162 242.92v-75.373c0-33.538-27.281-60.82-60.819-60.82s-60.819 27.282-60.819 60.82v178.762l-114.49 97.328c-8.533 7.246-9.573 20.046-2.316 28.569 4.01 4.722 9.71 7.146 15.452 7.146 4.642 0 9.305-1.584 13.116-4.83l47.693-40.544v387.874c0 33.538 27.281 60.82 60.818 60.82h308.031c37.584 22.082 81.185 34.974 127.838 34.974 51.893 0 100.158-15.732 140.376-42.6 5.33-2.906 10.286-6.38 14.503-10.682 59.814-46.394 98.534-118.743 98.534-200.129zM217.524 821.853V399.511l33.4-28.393c.21-.178.29-.438.491-.623 1.087-.998 1.86-2.222 2.708-3.436.681-.976 1.477-1.855 1.965-2.915.506-1.088.666-2.293.974-3.476.361-1.402.79-2.748.847-4.191.01-.28.161-.517.161-.8v-188.13c0-11.175 9.098-20.272 20.273-20.272 11.176 0 20.273 9.097 20.273 20.273V286.75c0 .99.426 1.836.563 2.787.197 1.412.338 2.785.837 4.144.509 1.383 1.303 2.544 2.086 3.767.503.793.72 1.693 1.346 2.429.18.21.438.29.623.492.998 1.085 2.218 1.855 3.43 2.702.982.684 1.867 1.485 2.935 1.977 1.065.495 2.244.648 3.4.954 1.43.375 2.807.81 4.28.866.272.01.5.155.775.155.96 0 1.78-.416 2.704-.545 1.449-.196 2.857-.346 4.25-.86 1.364-.503 2.507-1.29 3.715-2.06.802-.51 1.714-.73 2.457-1.365l176.607-150.098c7.563-6.444 18.58-6.454 26.183-.05l270.932 228.158c-.037.514-.298.952-.298 1.476v66.515c-38.454-23.545-83.476-37.37-131.774-37.37-139.733 0-253.412 113.679-253.412 253.412 0 69.277 27.995 132.1 73.201 177.891H237.797c-11.175 0-20.273-9.098-20.273-20.274zm243.277-157.618c0-117.37 95.494-212.866 212.866-212.866s212.867 95.494 212.867 212.866-95.495 212.867-212.867 212.867-212.866-95.496-212.866-212.867z"></path>
              </g>
            </svg>
          </div>
          <p>Wallet</p>
        </div>
      </div>
    </div>
  );
}
