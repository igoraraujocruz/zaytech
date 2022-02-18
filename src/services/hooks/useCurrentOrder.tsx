import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import { api } from '../apiClient';
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
  inputSearch: string;
  GetCurrentOrder: (order: Order) => Promise<void>;
  ClearCurrentOrder: () => Promise<void>;
  EditOrder: (currentOrder: Order, values) => Promise<void>;
  GetOrderByFilter: (option: string) => void;
}

const CurrentOrderContext = createContext<CurrentContextData>(
  {} as CurrentContextData,
);

export const CurrentOrderProvider = ({
  children,
}: CurrentOrderProviderProps) => {
  const [currentOrder, setCurrentOrder] = useState<Order>({} as Order);
  const [inputSearch, setInputSearch] = useState<string>('');

  const GetCurrentOrder = useCallback(async (order: Order) => {
    setCurrentOrder(order);
  }, []);

  const GetOrderByFilter = async (option: string) => {
    setInputSearch(option);
  };

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
      value={{
        currentOrder,
        inputSearch,
        GetCurrentOrder,
        ClearCurrentOrder,
        EditOrder,
        GetOrderByFilter,
      }}
    >
      {children}
    </CurrentOrderContext.Provider>
  );
};

export const useCurrentOrder = () => {
  const context = useContext(CurrentOrderContext);

  return context;
};
