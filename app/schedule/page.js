// app/schedule/page.js

"use client"
import { useEffect, useState } from "react";
import ScheduleTable from "../components/ScheduleTable";
import { useData } from "../context/DataContext";

export default function SchedulePage() {

  const {scheduleData, setScheduleData} = useData()

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch('/api/data');
        const data = await res.json();

        if (data.success) {
          setScheduleData(data.result);
          console.log("RS", json.result);
        } else {
          console.error(json.error);
        }
      } catch (error) {
        console.error('data fetch failed:', error);
      }
    };

    fetchSchedule();
  }, []);






  return <ScheduleTable scheduleData={scheduleData}/>;
}
