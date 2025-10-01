"use client";
import { useEffect, useState } from "react";
import AutoNavigate from "./components/AutoNavigate";
import StageName from "./components/StageName";

export default function Home() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [hide, sethide] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/data", { cache: "no-store" });
        const json = await res.json();

        if (json.success) {
          setData(json.result);
        } else {
          setError(json.error || "Failed to fetch data");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  // Function to request fullscreen
  const handleFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) { // Safari
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { // IE11
      document.documentElement.msRequestFullscreen();
    }
  };

  return (
    <div className="h-screen w-full">

      {hide? "" :  
      <button
        onClick={()=>{handleFullscreen();
          sethide(true)}
        }

        className="absolute top-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Go Fullscreen
      </button>
 }
     
      <StageName data={data} />
    </div>
  );
}
