// context/MedicineContext.tsx
import React, { createContext, useContext, useState } from "react";

interface Medicine {
  id: number;
  name: string;
  date: string;
}

interface MedicineContextValue {
  medicines: Medicine[];
  addMedicine: (medicine: Medicine) => void;
  removeMedicine: (id: number) => void;
}

const MedicineContext = createContext<MedicineContextValue | undefined>(
  undefined
);

export const MedicineProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [medicines, setMedicines] = useState<Medicine[]>([
    { id: 1, name: "타이레놀", date: "2025.08.20~2025.08.30" },
    { id: 2, name: "애드빌", date: "2025.08.20~2025.08.30" },
    { id: 3, name: "게보린", date: "2025.08.20~2025.08.30" },
  ]);

  const addMedicine = (medicine: Medicine) =>
    setMedicines((prev) => [...prev, medicine]);
  const removeMedicine = (id: number) =>
    setMedicines((prev) => prev.filter((m) => m.id !== id));

  return (
    <MedicineContext.Provider
      value={{ medicines, addMedicine, removeMedicine }}
    >
      {children}
    </MedicineContext.Provider>
  );
};

export const useMedicineContext = () => {
  const context = useContext(MedicineContext);
  if (!context)
    throw new Error("useMedicineContext must be used within MedicineProvider");
  return context;
};
