import { Box, Flex } from '@chakra-ui/react';
import Header from '../components/Header';
import Order from './orders';
import CreateOrder from './orders/create';
import { withSSRGuest } from '../utils/WithSSRGuest';

const Dashboard = () => {
  return (
    <Box>
      <Header />
      <Flex>
        <Order />
        <CreateOrder />
      </Flex>
    </Box>
  );
};

export const getServerSideProps = withSSRGuest(async ctx => {
  return {
    props: {},
  };
});

export default Dashboard;
