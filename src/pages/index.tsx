import { Flex, Button, Stack } from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '../components/Form/Input';
import { useAuth } from '../services/hooks/useAuth';
import { withSSRGuest } from '../utils/WithSSRGuest';

type SignInFormData = {
  email: string;
  password: string;
};

const signInFormSchema = yup.object().shape({
  email: yup.string().required('E-mail obrigatório').email(),
  password: yup.string().required('Senha obrigatória'),
});

const Home = () => {
  const { signIn } = useAuth();

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(signInFormSchema),
  });

  const handleSignIn: SubmitHandler<SignInFormData> = async values => {
    await signIn({
      email: values.email,
      password: values.password,
    });
  };
  return (
    <Flex w="100vw" h="100vh" align="center" justify="center">
      <Flex
        onSubmit={handleSubmit(handleSignIn)}
        as="form"
        w="100%"
        maxWidth={360}
        bg="gray.800"
        p="8"
        borderRadius={8}
        flexDir="column"
      >
        <Stack spacing="4">
          <Input
            name="email"
            label="E-mail"
            type="email"
            {...register('email')}
          />
          <Input name="password" label="Senha" {...register('password')} />
        </Stack>
        <Button type="submit" mt="6" colorScheme="pink" size="lg">
          Entrar
        </Button>
      </Flex>
    </Flex>
  );
};

export default Home;

export const getServerSideProps = withSSRGuest(async ctx => {
  return {
    props: {},
  };
});
