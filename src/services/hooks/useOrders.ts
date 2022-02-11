import { useQuery } from 'react-query';
import { api } from '../api';
import { queryClient } from '../queryClient';

type Order = {
  id: string;
  name: string;
  description?: string;
  contact: string;
  requesterId: string;
  client: string;
  createdAt: Date;
};

type GetOrdersResponse = {
  totalCount: number;
  orders: Order[];
};

export async function getOrders(page: number): Promise<GetOrdersResponse> {
  const { data, headers } = await api.get('/orders', {
    params: {
      page,
    },
  });

  const totalCount = Number(headers['x-total-count']);

  const orders = data.map(order => {
    return {
      id: order.id,
      name: order.name,
      description: order.description,
      requesterId: order.requesterId,
      client: order.client,
      contact: order.contact,
      createdAt: new Date(order.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    };
  });

  return { orders, totalCount };
}

export async function deleteOrders(orderId: string) {
  await api.delete(`/orders/${orderId}`);

  queryClient.invalidateQueries('orders');
}

export function useOrders(page: number) {
  return useQuery(['orders', page], () => getOrders(page));
}
