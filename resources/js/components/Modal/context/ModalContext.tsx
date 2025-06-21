import React, { createContext, useState } from "react";

interface Props {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalContext = createContext<Props>({
  state: false,
  setState: () => null,
});

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<boolean>(false);

  return (
    <ModalContext.Provider value={{ state, setState }}>
      {children}
    </ModalContext.Provider>
  );
};
