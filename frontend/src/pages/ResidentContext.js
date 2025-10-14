import React, { createContext, useState, useContext } from 'react';

const ResidentContext = createContext();

export const ResidentProvider = ({ children }) => {
  const [residentCount, setResidentCount] = useState(0);

  return (
    <ResidentContext.Provider value={{ residentCount, setResidentCount }}>
      {children}
    </ResidentContext.Provider>
  );
};

export const useProductContext = () => useContext(ResidentContext);
