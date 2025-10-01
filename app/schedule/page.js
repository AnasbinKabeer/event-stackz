// app/schedule/page.js

"use client"
import { useEffect, useState } from "react";
import ScheduleTable from "../components/ScheduleTable";
import { useData } from "../context/DataContext";

export default function SchedulePage() {

  const {scheduleData, setScheduleData, stage} = useData()

  useEffect(() => {
  const fetchSchedule = async () => {
    try {
      const res = await fetch("/api/data");
      const json = await res.json();

      if (json.success) {
        // filter according to stage
        const filtered = json.result.filter(
          (item) => item.stage === stage?.username
        );

        setScheduleData(filtered);
        console.log("Filtered Schedule:", filtered);
      } else {
        console.error(json.error);
      }
    } catch (error) {
      console.error("data fetch failed:", error);
    }
  };

  fetchSchedule();
}, [stage, setScheduleData]); 






  return <ScheduleTable scheduleData={scheduleData}/>;
}
