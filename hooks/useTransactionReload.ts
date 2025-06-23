import { useCallback, useState } from 'react';

type ReloadCallback = () => void;

const useTransactionReload = () => {
  const [reloadTrigger, setReloadTrigger] = useState(0);
  
  const triggerReload = useCallback(() => {
    setReloadTrigger(prev => prev + 1);
  }, []);
  
  return {
    reloadTrigger,
    triggerReload
  };
};

export default useTransactionReload;
