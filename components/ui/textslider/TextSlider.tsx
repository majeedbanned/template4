"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
type Props = {};
const slides = [
  {
    id: 1,
    title: "title 2",
    subtitle: "subtitle 2",
    buttonTitle: "order",
    image: "img 2",
  },
  {
    id: 2,
    title: "title 3",
    subtitle: "subtitle 2",
    buttonTitle: "order",
    image: "img 3",
  },
  {
    id: 3,
    title: "title 4",
    subtitle: "subtitle 2",
    buttonTitle: "order",
    image: "img 4",
  },
  {
    id: 4,
    title: "title 5",
    subtitle: "subtitle 2",
    buttonTitle: "order",
    image: "img 5",
  },
  {
    id: 5,
    title: "title 6",
    subtitle: "subtitle 2",
    buttonTitle: "order",
    image: "img 6",
  },
];

function getBodyDirection() {
  return "ltr";
  const bodyElement = document.getElementsByTagName("body")[0];
  const computedStyle = window.getComputedStyle(bodyElement);
  return computedStyle.direction;
}
export default function TextSlider({}: Props) {
  const [slideIndex, setSlideIndex] = useState(0);

  const next = () => {
    setSlideIndex(slideIndex === slides.length - 1 ? 0 : slideIndex + 1);
  };
  useEffect(() => {
    const slideInterval = setInterval(next, 4000);
    return () => {
      clearInterval(slideInterval);
    };
  }, [slideIndex]);
  return (
    <div className="flex h-full flex-col overflow-hidden   ">
      <div
        className="flex flex-1 relative h-full w-full p-4  overflow-hidden
      flex-col
      "
      >
        <div className="">
          <AnimatePresence>
            <motion.div
              key={slideIndex}
              variants={variants}
              custom={getBodyDirection()}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute  h-full"
            >
              <motion.h1
                className=" flex items-center   space-y-4 justify-start w-full  text-[46px]"
                key={slideIndex}
                initial="enter"
                animate="center"
                exit="exit"
                variants={variants}
                custom={getBodyDirection()}
                //   transition={{ damping: 10 }}
              >
                {slides[slideIndex].title}
              </motion.h1>

              <motion.h1
                className=" flex items-center text-start my-2 justify-start  w-2/3  text-xl"
                key={slideIndex}
                initial="enter"
                animate="center"
                exit="exit"
                variants={variants}
                custom={getBodyDirection()}
                transition={{ delay: 0.1 }}
              >
                {slides[slideIndex].subtitle}
              </motion.h1>
              <motion.h1
                className=" flex items-center justify-start my-2 w-full  text-xl"
                key={slideIndex}
                initial="enter"
                animate="center"
                exit="exit"
                variants={variants}
                custom={getBodyDirection()}
                transition={{ delay: 0.2 }}
              >
                {slides[slideIndex].buttonTitle}
              </motion.h1>
              {/* <img
              src="../../../public/images/logo.png"
              alt="hi"
              className="w-12 h-12"
            /> */}
            </motion.div>
          </AnimatePresence>
        </div>
        <motion.div
          key={slideIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-red-100 w-1/3 absolute right-0 top-24"
        >
          {slides[slideIndex].image}
        </motion.div>
      </div>
      <div className=" flex p-2 h-4 items-center justify-end flex-row space-x-5 ">
        {slides.map((slide, i) => (
          <div
            onClick={() => setSlideIndex(i)}
            className={`  ${
              slideIndex === i ? "p-1 bg-orange-500" : ""
            }  transition-all w-3 h-3  border-2 rounded-full cursor-pointer border-slate-400`}
            key={slide.id}
          ></div>
        ))}
      </div>
    </div>
  );
}

let variants = {
  enter: (direction: string) => ({
    x: direction === "ltr" ? -200 : 200,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: string) => ({
    opacity: 0,
    x: direction === "ltr" ? 150 : -150,
  }),
};
