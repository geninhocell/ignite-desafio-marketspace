import { Image, IImageProps } from 'native-base';
import React from 'react';

type Props = IImageProps & {
  size: number;
};

export function UserPhoto({ size, ...rest }: Props) {
  return <Image h={size} w={size} rounded="full" {...rest} />;
}
