import {
  TextArea as NativeBaseTextArea,
  ITextAreaProps,
  FormControl,
} from 'native-base';

type Props = ITextAreaProps & {
  errorMessage?: string | null;
};

export function TextArea({ errorMessage = null, isInvalid, ...rest }: Props) {
  const invalid = !!errorMessage || isInvalid;

  return (
    <FormControl isInvalid={invalid} mb={4}>
      <NativeBaseTextArea
        autoCompleteType={undefined}
        bg="gray.700"
        px={4}
        py={3}
        borderWidth={0}
        fontSize="md"
        color="gray.300"
        fontFamily="body"
        placeholderTextColor="gray.400"
        isInvalid={invalid}
        _invalid={{
          borderWidth: 1,
          borderColor: 'red',
        }}
        _focus={{
          bg: 'gray.700',
          borderWidth: 1,
          borderColor: 'green.500',
        }}
        {...rest}
      />
      <FormControl.ErrorMessage
        _text={{
          color: 'red',
        }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}
