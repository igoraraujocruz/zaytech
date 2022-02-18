import { Box, Flex } from '@chakra-ui/react';
import Header from '../components/Header';
import { withSSRAuth } from '../utils/WithSSRAuth';
import Order from './orders';
import CreateOrder from './orders/create';

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

export default Dashboard;

export const getServerSideProps = withSSRAuth(async ctx => {
  return {
    props: {},
  };
});
