import { Text, ITextProps } from 'native-base';

type Props = ITextProps & {
  text: string;
};

export function TextRegular({ text, ...rest }: Props) {
  return (
    <Text fontSize="sm" fontFamily="body" color="gray.200" {...rest}>
      {text}
    </Text>
  );
}
