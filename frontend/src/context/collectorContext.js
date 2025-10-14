import React, { createContext, useState, useEffect } from "react";

export const CollectorContext = createContext();

export function CollectorProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  // On initial load, check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("collectorUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Login method to set user state and store in local storage
  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem("authToken", user.token);
    localStorage.setItem("collectorId", user.collectorId);
    localStorage.setItem("collectorUser", JSON.stringify(user));
  };

  // Logout method to clear user state and local storage
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("collectorId");
    localStorage.removeItem("collectorUser");
  };

  return (
    <CollectorContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </CollectorContext.Provider>
  );
}
