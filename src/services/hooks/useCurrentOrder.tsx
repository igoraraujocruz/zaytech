import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import { api } from '../api';

interface CurrentOrderProviderProps {
  children: ReactNode;
}

interface Order {
  id: string;
  name: string;
  description?: string;
  contact: string;
  requester: string;
  client: string;
  createdAt: Date;
}

interface CurrentContextData {
  currentOrder: Order;
  GetCurrentOrder: (order: Order) => Promise<void>;
  ClearCurrentOrder: () => Promise<void>;
}

const CurrentOrderContext = createContext<CurrentContextData>(
  {} as CurrentContextData,
);

export const CurrentOrderProvider = ({
  children,
}: CurrentOrderProviderProps) => {
  const [currentOrder, setCurrentOrder] = useState<Order>({} as Order);

  const GetCurrentOrder = useCallback(async (order: Order) => {
    setCurrentOrder(order);
  }, []);

  const ClearCurrentOrder = useCallback(async () => {
    setCurrentOrder(undefined);
  }, []);

  return (
    <CurrentOrderContext.Provider
      value={{ currentOrder, GetCurrentOrder, ClearCurrentOrder }}
    >
      {children}
    </CurrentOrderContext.Provider>
  );
};

export const useCurrentOrder = () => {
  const context = useContext(CurrentOrderContext);

  return context;
};
