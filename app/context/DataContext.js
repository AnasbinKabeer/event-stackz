'use client';
import { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [stage, setStage] = useState(null);
  const [scheduleData, setScheduleData] = useState()



  return (
    <DataContext.Provider value={{
        
stage, setStage,
scheduleData, setScheduleData

     }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);