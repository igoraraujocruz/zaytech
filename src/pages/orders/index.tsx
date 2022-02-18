import {
  Box,
  Checkbox,
  Flex,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  HStack,
} from '@chakra-ui/react';
import { BiTrashAlt } from 'react-icons/bi';
import { AiOutlineEdit } from 'react-icons/ai';
import { useOrders, deleteOrders } from '../../services/hooks/useOrders';
import { useCurrentOrder } from '../../services/hooks/useCurrentOrder';

const Order = () => {
  const { GetCurrentOrder, inputSearch } = useCurrentOrder();

  const { data, isLoading, error, isFetching } = useOrders();
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  return (
    <Box>
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px={['4', '4', '6']}>
        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Pedidos
              {!isLoading && isFetching && (
                <Spinner size="sm" color="gray.500" ml="4" />
              )}
            </Heading>
          </Flex>
          {isLoading ? (
            <Flex justify="center">
              <Spinner />
            </Flex>
          ) : error ? (
            <Flex justify="center">
              <Text>Falha ao obter dados dos pedidos.</Text>
            </Flex>
          ) : (
            <Table colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th px={['4', '4', '6']} color="gray.300" width="8">
                    <Checkbox colorScheme="pink" />
                  </Th>
                  <Th>Nome/Descrição</Th>
                  <Th>Cliente</Th>
                  <Th>Contato</Th>
                  <Th>Data do pedido</Th>
                  <Th>Solicitante</Th>
                  <Th width="8" />
                </Tr>
              </Thead>
              <Tbody>
                {data
                  .filter(val => {
                    if (inputSearch === '') {
                      return val;
                    }

                    if (
                      val.name
                        .toLowerCase()
                        .includes(inputSearch.toLowerCase()) ||
                      val.client
                        .toLowerCase()
                        .includes(inputSearch.toLowerCase()) ||
                      val.requester.name
                        .toLowerCase()
                        .includes(inputSearch.toLowerCase()) ||
                      val.contact
                        .toLowerCase()
                        .includes(inputSearch.toLowerCase())
                    ) {
                      return val;
                    }
                    return null;
                  })
                  .map(order => (
                    <Tr key={order.id}>
                      <Td px={['4', '4', '6']}>
                        <Checkbox colorScheme="pink" />
                      </Td>
                      <Td>
                        <Box>
                          <Text fontSize="sm" color="gray.100">
                            {order.name}
                          </Text>
                          <Text fontSize="sm" color="gray.100">
                            {order.description}
                          </Text>
                        </Box>
                      </Td>
                      <Td fontSize="sm" color="gray.100">
                        {order.client}
                      </Td>
                      <Td fontSize="sm" color="gray.100">
                        {order.contact}
                      </Td>
                      {isWideVersion && (
                        <Td fontSize="sm" color="gray.100">
                          {order.createdAt}
                        </Td>
                      )}
                      <Td fontSize="sm" color="gray.100">
                        {order.requester.name}
                      </Td>
                      <Td>
                        <HStack justifyContent="center">
                          <AiOutlineEdit
                            size={22}
                            onClick={() => GetCurrentOrder(order)}
                          />
                          <BiTrashAlt
                            size={22}
                            cursor="pointer"
                            onClick={() => deleteOrders(order.id)}
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default Order;
