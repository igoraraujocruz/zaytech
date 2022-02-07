import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';
import { Input } from '../../components/Form/Input';
import { api } from '../../services/api';
import { queryClient } from '../../services/queryClient';
import { useCurrentOrder } from '../../services/hooks/useCurrentOrder';
import { EditOrder } from '../../services/hooks/useOrders';

type CreateOrderFormData = {
  name: string;
  client: string;
  description?: string;
  contact: string;
};

interface Order extends CreateOrderFormData {
  id: string;
  createdAt: Date;
  requester: string;
}

const createOrderFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  client: yup.string().required('Nome do cliente é obrigatório'),
  description: yup.string(),
  contact: yup.string(),
});

const CreateOrder = () => {
  const createOrder = useMutation(
    async (order: CreateOrderFormData) => {
      const response = await api.post('orders', {
        order: {
          ...order,
          created_at: new Date(),
          requester: 'solicitante teste',
        },
      });
      return response.data.order;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orders');
      },
    },
  );

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(createOrderFormSchema),
  });

  const { errors } = formState;

  // const handleCreateOrder: SubmitHandler<
  //   CreateOrderFormData
  // > = async values => {
  //   await createOrder.mutateAsync(values);
  //   reset();
  // };

  const { currentOrder, ClearCurrentOrder } = useCurrentOrder();

  const handleVerifyOrder = async values => {
    if (currentOrder.name === undefined) {
      await createOrder.mutateAsync(values);
      reset();
    } else {
      EditOrder(currentOrder);
    }
  };

  return (
    <Box>
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Box
          as="form"
          autoComplete="off"
          onSubmit={handleSubmit(handleVerifyOrder)}
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={['6', '8']}
        >
          <Heading size="lg" fontWeight="normal">
            {currentOrder?.name === undefined ? (
              <>Criar Pedido</>
            ) : (
              <>Editar Pedido</>
            )}
          </Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
              <Input
                name="name"
                label="Pedido"
                {...register('name')}
                error={errors.name}
                defaultValue={currentOrder?.name}
              />
              <Input
                name="client"
                label="Cliente"
                {...register('client')}
                error={errors.client}
                defaultValue={currentOrder?.client}
              />
              <Input
                name="description"
                label="Descrição"
                {...register('description')}
                error={errors.description}
                defaultValue={currentOrder?.description}
              />
              <Input
                name="contact"
                label="Contato"
                {...register('contact')}
                error={errors.contact}
                defaultValue={currentOrder?.contact}
              />
            </SimpleGrid>
          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Button
                type="submit"
                isLoading={formState.isSubmitting}
                colorScheme="pink"
              >
                Salvar
              </Button>
              <Button
                type="button"
                onClick={() => ClearCurrentOrder()}
                colorScheme="pink"
              >
                Limpar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default CreateOrder;
