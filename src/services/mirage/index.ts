import {
  createServer,
  Factory,
  Model,
  Response,
  ActiveModelSerializer,
} from 'miragejs';
import faker from 'faker';

type Order = {
  name: string;
  description?: string;
  created_at: string;
  contact: string;
  requester: string;
  client: string;
};

export function makeServer() {
  const server = createServer({
    serializers: {
      application: ActiveModelSerializer,
    },
    models: {
      order: Model.extend<Partial<Order>>({}),
    },

    factories: {
      order: Factory.extend({
        name(i: number) {
          return `Capa de celular ${i + 1}`;
        },
        description() {
          return faker.lorem.sentence();
        },
        contact() {
          return faker.phone.phoneNumber('(27) 9156552135');
        },
        requester() {
          return faker.name.firstName();
        },
        client() {
          return faker.name.firstName();
        },
        createdAt() {
          return faker.date.recent(10);
        },
      }),
    },

    seeds(server) {
      server.createList('order', 5);
    },

    routes() {
      this.namespace = 'api';
      this.timing = 750;

      this.get('/orders', function (schema, request) {
        const { page = 1, perPage = 10 } = request.queryParams;
        const total = schema.all('order').length;
        const pageStart = (Number(page) - 1) * Number(perPage);
        const pageEnd = pageStart + Number(perPage);
        const orders = this.serialize(schema.all('order')).orders.slice(
          pageStart,
          pageEnd,
        );
        return new Response(
          200,
          { 'x-total-count': String(total) },
          { orders },
        );
      });
      this.post('/orders');
      this.delete('/orders/:id');
      this.put('/orders/:id');

      this.namespace = '';
      this.passthrough();
    },
  });

  return server;
}
