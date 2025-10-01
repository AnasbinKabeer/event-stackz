"use client";

import { OctagonAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import Clock from "./Clock";
import { useData } from "../context/DataContext";

export default function ScheduleTable({ scheduleData }) {
  const router = useRouter();
  const { stage } = useData();

  const headerRef = useRef(null);
  const tableRef = useRef(null);
  const alertRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(new Date());

  // keep updating current time
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        duration: 1,
        y: -50,
        opacity: 0,
        ease: "power3.out",
      });

      gsap.from(tableRef.current.querySelectorAll("tbody tr"), {
        duration: 0.8,
        y: 20,
        opacity: 0,
        stagger: 0.2,
        ease: "power2.out",
      });

      gsap.from(alertRef.current, {
        duration: 1,
        y: 20,
        opacity: 0,
        delay: 1,
        ease: "bounce.out",
      });
    });

    const timer = setTimeout(() => {
      router.push("/stage");
    }, 20000);


    return () => {
      ctx.revert();
          clearTimeout(timer);
}
  }, [router]);

  // helper: parse "07:00 AM" → Date today
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

  // get status of program
  const getStatus = (row) => {
    const startTime = parseTime(row.onStart || row.onsStart);
    const endTime = parseTime(row.endTime);
    if (!startTime || !endTime) return "Upcoming";

    if (currentTime >= startTime && currentTime <= endTime) return "Now";
    if (currentTime > endTime) return "Finished";
    return "Upcoming";
  };

  // find next upcoming program
  const nextProgram = scheduleData
    ?.map((row) => ({ ...row, startTime: parseTime(row.onStart || row.onsStart) }))
    .filter((row) => row.startTime && row.startTime > currentTime)
    .sort((a, b) => a.startTime - b.startTime)[0];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-10 flex flex-col items-center">
      {/* Header */}
      <div
        ref={headerRef}
        className="w-full max-w-5xl flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 px-4"
      >
        <div className="flex items-center gap-3">
          <div className="text-violet-600 text-3xl font-black py-2 rounded-full">
            Stage 0{stage?.username} -
          </div>
          <h1 className="text-3xl font-medium text-gray-900 mb-2 sm:mb-0">
            Schedule
          </h1>
        </div>
        <Clock />
      </div>

      {/* Table */}
      <div
        ref={tableRef}
        className="w-full max-w-5xl bg-white border border-zinc-300 rounded-2xl overflow-hidden"
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
                Time
              </th>
             
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {scheduleData?.map((row, index) => {
              const status = getStatus(row);
              return (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 transition-colors duration-200 ${
                    status === "Now" ? "bg-green-100" : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-lg font-semibold text-gray-800">
                    {row.program}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-600">
                    {row.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-600">
                    {row.onStart}
                  </td>
                
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1.5 text-sm rounded-full font-semibold ${
                        status === "Now"
                          ? "bg-green-200 text-green-800"
                          : status === "Finished"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Alert */}
      <div
        ref={alertRef}
        className="w-full max-w-4xl bg-yellow-100 text-center mt-auto rounded-4xl"
      >
        <p className="flex p-4 items-center justify-center gap-4">
          <OctagonAlert className="text-yellow-500" />
          {nextProgram
            ? `Next Program "${nextProgram.program}" will start at ${
                nextProgram.onStart || nextProgram.onsStart
              }`
            : "No more upcoming programs"}
        </p>
      </div>
    </div>
  );
}
