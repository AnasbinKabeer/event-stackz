"use client"; 
import { ArrowRight } from "lucide-react"; 
import { useEffect, useState, useRef } from "react"; 
import { gsap } from "gsap"; 
import { useRouter } from "next/navigation"; 
import { useData } from "../context/DataContext"; 

export default function NowScreen() { 
  const [time, setTime] = useState(""); 
  const nowRef = useRef(null); 
  const [currentTime, setCurrentTime] = useState(new Date());
  const titleRef = useRef(null); 
  const nextProgramRef = useRef(null); 
  const router = useRouter(); 
  const {stage, scheduleData} = useData() 

  // Clock updater
  useEffect(() => { 
    const updateClock = () => { 
      const now = new Date(); 
      const hours = now.getHours() % 12 || 12; 
      const minutes = now.getMinutes().toString().padStart(2, "0"); 
      const ampm = now.getHours() >= 12 ? "PM" : "AM"; 
      setTime(`${hours}:${minutes} ${ampm}`); 
    }; 

    updateClock(); 
    const interval = setInterval(updateClock, 1000); 
    return () => clearInterval(interval); 
  }, []); 

  // GSAP animations
useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(nowRef.current, {
        duration: 1,
        y: -50,
        opacity: 0,
        ease: "bounce.out",
      });

      gsap.from(titleRef.current, {
        duration: 1.2,
        x: -100,
        opacity: 0,
        delay: 0.5,
        ease: "power3.out",
      });

      if (nextProgramRef.current) {
        gsap.from(nextProgramRef.current.children, {
          duration: 1,
          y: 20,
          opacity: 0,
          delay: 1,
          ease: "power2.out",
          stagger: 0.3,
        });
      }

      gsap.to(nowRef.current, {
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        repeatDelay: 4.5,
        ease: "power1.inOut",
      });

      gsap.to(titleRef.current, {
        y: 5,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        repeatDelay: 4.5,
        ease: "power1.inOut",
      });
    });

    const timer = setTimeout(() => {
      router.push("/schedule");
    }, 20000);

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, [router]);

  const parseTime = (timeStr) => {
    if (!timeStr) return null;
    const [time, modifier] = timeStr.trim().split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Determine current program
  const currentProgram = scheduleData?.find((row) => {
    const start = parseTime(row.onStart || row.onsStart);
    const end = parseTime(row.endTime);
    return start && end && currentTime >= start && currentTime <= end;
  });

  // Find next program
  const nextProgram = scheduleData
    ?.map((row) => ({ ...row, startTime: parseTime(row.onStart || row.onsStart) }))
    .filter((row) => row.startTime && row.startTime > currentTime)
    .sort((a, b) => a.startTime - b.startTime)[0];


  return ( 
    <div className="h-screen bg-gradient-to-br from-violet-100 via-white to-indigo-200 flex flex-col items-center justify-between p-6 sm:p-10"> 
      {/* Header Section */} 
      <div className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-6"> 
        <div className="text-3xl sm:text-4xl ml-6 font-extrabold text-violet-700 tracking-wide"> 
          Stage <span className="text-black">0{stage?.username}</span> 
        </div> 

        {/* Current Time Card */} 
        <div className="bg-white shadow-2xl rounded-3xl px-10 py-4 flex flex-col items-center"> 
          <div className="text-gray-500 uppercase tracking-widest text-sm"> Clock </div> 
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-700 tracking-wide"> {time} </div> 
        </div> 
      </div> 

      {/* NOW Section */} 
      <div className="text-center" ref={nowRef}> 
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-5xl sm:text-7xl font-extrabold py-5 px-16 rounded-[3rem] shadow-xl animate-pulse"> NOW </div> 
      </div> 

      {/* Program Info */} 
      <div className="w-full max-w-4xl text-center" ref={titleRef}> 
        <p className="text-7xl sm:text-8xl font-extrabold text-gray-800 drop-shadow-md">  {currentProgram?.program} </p> 
        <p className="text-3xl sm:text-4xl mt-4 font-semibold text-gray-600">  ({currentProgram?.category}) </p> 
      </div> 

      {/* Next Program Card */} 
      <div className=" min-w-3xl mt-8 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-3xl shadow-2xl py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-6" ref={nextProgramRef} > 
        <div className="flex items-center flex-col justify-center w-30 h-10 text-black bg-white rounded-2xl shadow-lg"> 
          <p className="flex items-center justify-center font-bold text-2xl animate-pulse gap-2"> 
            <ArrowRight className="w-5 h-5 text-black mb-1" /> Next 
          </p> 
        </div> 
        <div className="flex-1 flex items-center text-center sm:text-left gap-2"> 
          <p className="text-2xl font-extrabold tracking-wide">{nextProgram?.program} </p> 
          <p className="text-xl  font-semibold text-white/80">  ({nextProgram?.category})</p> 
        </div> 
        <div className="flex justify-center items-center sm:items-end gap-2 bg-white/20 backdrop-blur-md rounded-full px-6 py-2"> 
          <span className="text-lg sm:text-xl font-medium text-white/90"> Starts at <span className="font-black">{nextProgram?.onStart}</span> </span> 
        </div> 
      </div> 
    </div> 
  ); 
}
