import React, { createContext, useCallback, useContext, useState } from 'react';

interface TransactionContextType {
  triggerReload: () => void;
  reloadTrigger: number;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactionContext must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reloadTrigger, setReloadTrigger] = useState(0);
  
  const triggerReload = useCallback(() => {
    console.log('TransactionContext: Triggering reload...');
    setReloadTrigger(prev => prev + 1);
  }, []);
  
  return (
    <TransactionContext.Provider value={{ triggerReload, reloadTrigger }}>
      {children}
    </TransactionContext.Provider>
  );
};
