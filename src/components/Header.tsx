import { Flex, Text, Input, Icon, HStack, Box, Avatar } from '@chakra-ui/react';
import { RiSearchLine, RiNotificationLine } from 'react-icons/ri';
import { useCurrentOrder } from '../services/hooks/useCurrentOrder';
import { signOut } from '../services/hooks/useAuth';

const Header = () => {
  const { GetOrderByFilter } = useCurrentOrder();

  return (
    <Flex
      as="header"
      w="100%"
      maxWidth={1480}
      h="20"
      mx="auto"
      mt="4"
      px="6"
      align="center"
    >
      <Text fontSize="3xl" fontWeight="bold" letterSpacing="tight" w="64">
        Zaycon
        <Text as="span" ml="1" color="pink.500">
          .
        </Text>
      </Text>
      <Flex
        as="label"
        flex="1"
        py="4"
        px="8"
        ml="6"
        maxWidth={400}
        alignSelf="center"
        color="gray.200"
        position="relative"
        bg="gray.800"
        borderRadius="full"
      >
        <Input
          color="gray.50"
          variant="unstyled"
          px="4"
          mr="4"
          placeholder="Buscar"
          _placeholder={{ color: 'gray.400' }}
          onChange={e => GetOrderByFilter(e.target.value)}
        />
        <Icon as={RiSearchLine} fontSize="20" />
      </Flex>

      <Flex align="center" ml="auto">
        <HStack
          spacing="8"
          mx="8"
          pr="8"
          py="1"
          color="gray.300"
          borderRightWidth={1}
          borderColor="gray.700"
        >
          <Icon as={RiNotificationLine} fontSize="20" />
          <button type="button" onClick={() => signOut()}>
            SignOut
          </button>
        </HStack>

        <Flex align="center">
          <Box mr="4" textAlign="right">
            <Text>Igor Araujo Cruz</Text>
            <Text color="gray.300" fontSize="small">
              igoraraujocruzz@gmail.com
            </Text>
          </Box>
          <Avatar
            size="md"
            name="Igor Araujo Cruz"
            src="https://github.com/igoraraujocruz.png"
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Header;
