import { Text, ITextProps } from 'native-base';

type Props = ITextProps & {
  text: string;
};

export function TextLight({ text, ...rest }: Props) {
  return (
    <Text fontSize="sm" fontFamily="mono" color="gray.300" {...rest}>
      {text}
    </Text>
  );
}
