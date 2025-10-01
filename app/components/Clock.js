
import React, { useEffect, useState } from 'react'

export default function Clock() {

      const [time, setTime] = useState("");
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
    
  return (
    <div className="bg-white shadow-2xl rounded-3xl px-10 py-4 flex flex-col items-center">
          
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-700 tracking-wide">
            {time}
          </div>
        </div>
  )
}
