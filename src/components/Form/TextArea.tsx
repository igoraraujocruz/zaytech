import { Textarea } from '@chakra-ui/react';
import { useState } from 'react';

export const TextArea = () => {
  const [value, setValue] = useState('');

  const handleInputChange = e => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };
  return (
    <Textarea
      borderColor="gray.900"
      value={value}
      onChange={handleInputChange}
      placeholder="Comentário"
      bgColor="gray.900"
      size="md"
      focusBorderColor="pink.500"
      _hover={{
        bgColor: 'gray.900',
      }}
    />
  );
};
