import { useContext } from "react";
import { LocationContext } from "../context/LocationContext";
import type { LocationContextType } from "../context/LocationContext";

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
