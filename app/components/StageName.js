"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import { useData } from "../context/DataContext";

export default function StageName({data}) {
  const stageRef = useRef(null);
  const nameRef = useRef(null);
  const footerRef = useRef(null);
  const router = useRouter();


    const {stage, setStage} = useData()



   useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setStage(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(stageRef.current, {
        y: -200,
        opacity: 0,
        duration: 1.2,
        scale: 0.8,
      });

      tl.from(
        nameRef.current,
        { y: 50, opacity: 0, duration: 1 },
        "-=0.5"
      );

      tl.from(
        footerRef.current,
        { y: 100, opacity: 0, duration: 1 },
        "-=0.5"
      );
    });

    // Navigate after 6 seconds
    const timer = setTimeout(() => {
      router.push("/now");
    }, 6000);

    // Cleanup GSAP context and timer on unmount
    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-violet-50 via-violet-100 to-white">
      <main className="h-screen w-full flex flex-col items-center justify-center">
        <h1
          ref={stageRef}
          className="text-[200px] sm:text-[120px] md:text-[200px] font-extrabold text-violet-700 uppercase drop-shadow-lg"
        >
          Stage  0{stage?.username}
        </h1>
        <h1
          ref={nameRef}
          className="text-8xl sm:text-5xl md:text-7xl -mt-10 font-semibold uppercase text-black tracking-wider"
        >
         {stage?.shortName}
        </h1>
      </main>

      <footer className="mt-auto mb-20">
        <div ref={footerRef}>
          <Image
            src="/Primary_Logo.png"
            alt="footer image"
            width={400}
            height={220}
            className="drop-shadow-2xl"
          />
        </div>
      </footer>
    </div>
  );
}
