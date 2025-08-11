// UserContext.tsx
import { createContext, useState } from "react";
import type { ReactNode } from "react";
interface UserContextType {
  userId: number;
  setUserId: (id: number) => void;
}

export const UserContext = createContext<UserContextType>({
  userId: 0,
  setUserId: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<number>(0);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
}
