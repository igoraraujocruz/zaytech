import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import { api } from '../api';
import { queryClient } from '../queryClient';

interface CurrentOrderProviderProps {
  children: ReactNode;
}

interface Order {
  id: string;
  name: string;
  description?: string;
  contact: string;
  requesterId: string;
  client: string;
  createdAt: Date;
}

interface CurrentContextData {
  currentOrder: Order;
  GetCurrentOrder: (order: Order) => Promise<void>;
  ClearCurrentOrder: () => Promise<void>;
  EditOrder: (currentOrder: Order, values) => Promise<void>;
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

  const EditOrder = async (currentOrder: Order, values) => {
    await api.put(`orders/${currentOrder.id}`, {
      ...values,
    });

    queryClient.invalidateQueries('orders');
  };

  return (
    <CurrentOrderContext.Provider
      value={{ currentOrder, GetCurrentOrder, ClearCurrentOrder, EditOrder }}
    >
      {children}
    </CurrentOrderContext.Provider>
  );
};

export const useCurrentOrder = () => {
  const context = useContext(CurrentOrderContext);

  return context;
};
