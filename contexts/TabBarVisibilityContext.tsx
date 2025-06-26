import React, { createContext, useContext, useState } from "react";

const TabBarVisibilityContext = createContext<{
  visible: boolean;
  setVisible: (v: boolean) => void;
}>({
  visible: true,
  setVisible: () => {},
});

export const TabBarVisibilityProvider = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(true);
  return (
    <TabBarVisibilityContext.Provider value={{ visible, setVisible }}>
      {children}
    </TabBarVisibilityContext.Provider>
  );
};

export const useTabBarVisibility = () => useContext(TabBarVisibilityContext);