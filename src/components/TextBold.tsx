import { Text, ITextProps } from 'native-base';

type Props = ITextProps & {
  text: string;
};

export function TextBold({ text, ...rest }: Props) {
  return (
    <Text fontSize="sm" fontFamily="heading" color="gray.700" {...rest}>
      {text}
    </Text>
  );
}
