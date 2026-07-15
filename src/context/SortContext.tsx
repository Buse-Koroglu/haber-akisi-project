import { createContext, useContext, useState } from "react";

export type SortOption = "newest" | "oldest" | "source";

interface SortContextType {
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}

const SortContext = createContext<SortContextType | undefined>(undefined);

export const SortProvider = ({ children }: { children: React.ReactNode }) => {
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  return (
    <SortContext.Provider value={{ sortOption, setSortOption }}>
      {children}
    </SortContext.Provider>
  );
};

export const useSort = () => {
  const context = useContext(SortContext);
  if (!context) {
    throw new Error("useSort mutlaka SortProvider içinde kullanılmalıdır.");
  }
  return context;
};
