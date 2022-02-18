import { useQuery } from 'react-query';
import { api } from '../apiClient';
import { queryClient } from '../queryClient';

type Order = {
  id: string;
  name: string;
  description?: string;
  contact: string;
  requesterId: string;
  client: string;
  createdAt: Date;
  requester: {
    name: string;
  };
};

export const getOrders = async (): Promise<Order[]> => {
  const { data } = await api.get('/orders');

  const orders = data.map(order => {
    return {
      id: order.id,
      name: order.name,
      description: order.description,
      client: order.client,
      contact: order.contact,
      createdAt: new Date(order.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      requester: {
        name: order.requester.name,
      },
    };
  });

  return orders;
};

export async function deleteOrders(orderId: string) {
  await api.delete(`/orders/${orderId}`);

  queryClient.invalidateQueries('orders');
}

export function useOrders() {
  return useQuery(['orders'], () => getOrders());
}
