import { ProfilingData } from "@/model/profilingData";
import { ReactNode, createContext, useContext, useState } from "react";

export const DataContext = createContext<
  | {
      data: ProfilingData | undefined;
      setData: (data: ProfilingData | undefined) => void;
    }
  | undefined
>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export default function DataProvider({ children }: Props): JSX.Element {
  const [data, setData] = useState<ProfilingData | undefined>(undefined);

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
