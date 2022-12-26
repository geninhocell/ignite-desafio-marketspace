import { Button as NativeBaseButton, IButtonProps } from 'native-base';
import React from 'react';

import { TextBold } from './TextBold';

type Props = IButtonProps & {
  title: string;
  bg?: 'gray' | 'blue' | 'black';
};

export function Button({ title, bg = 'black', ...rest }: Props) {
  const bgAtual =
    bg === 'black' ? 'gray.100' : bg === 'blue' ? 'blueLight' : 'gray.500';

  const bgPressedAtual =
    bg === 'black' ? 'gray.200' : bg === 'blue' ? 'blue' : 'gray.600';

  const colorText =
    bg === 'black' ? 'gray.700' : bg === 'blue' ? 'gray.700' : 'gray.200';

  return (
    <NativeBaseButton
      w="full"
      bg={bgAtual}
      py={3}
      fontFamily="heading"
      fontSize="sm"
      rounded="sm"
      _pressed={{
        bg: bgPressedAtual,
      }}
      {...rest}>
      <TextBold color={colorText} text={title} />
    </NativeBaseButton>
  );
}
