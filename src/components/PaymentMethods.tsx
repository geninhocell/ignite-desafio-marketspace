import { Checkbox, Text, VStack, IStackProps } from 'native-base';

type Props = IStackProps & {
  onChange: (values: string[]) => void;
  values: string[];
};

export function PaymentMethods({ onChange, values, ...rest }: Props) {
  return (
    <VStack {...rest}>
      <Text color="gray.200" fontSize="sm" fontFamily="heading">
        Meios de pagamento aceitos
      </Text>

      <Checkbox.Group
        onChange={(values) => onChange(values || [])}
        value={values}
        accessibilityLabel="escolha dos meios de pagamento">
        <Checkbox
          _icon={{ color: 'white' }}
          _checked={{
            bg: 'blueLight',
            borderColor: 'blueLight',
            _pressed: { borderColor: 'blueLight', bg: 'blue' },
          }}
          _text={{ fontSize: 'md' }}
          size="md"
          my={1}
          value="boleto"
          accessibilityLabel="opção boleto">
          Boleto
        </Checkbox>

        <Checkbox
          _icon={{ color: 'white' }}
          _checked={{
            bg: 'blueLight',
            borderColor: 'blueLight',
            _pressed: { borderColor: 'blueLight', bg: 'blue' },
          }}
          _text={{ fontSize: 'md' }}
          size="md"
          my={1}
          value="pix"
          accessibilityLabel="opção pix">
          Pix
        </Checkbox>

        <Checkbox
          _icon={{ color: 'white' }}
          _checked={{
            bg: 'blueLight',
            borderColor: 'blueLight',
            _pressed: { borderColor: 'blueLight', bg: 'blue' },
          }}
          _text={{ fontSize: 'md' }}
          size="md"
          my={1}
          value="cash"
          accessibilityLabel="opção dinheiro">
          Dinheiro
        </Checkbox>

        <Checkbox
          _icon={{ color: 'white' }}
          _checked={{
            bg: 'blueLight',
            borderColor: 'blueLight',
            _pressed: { borderColor: 'blueLight', bg: 'blue' },
          }}
          _text={{ fontSize: 'md' }}
          size="md"
          my={1}
          value="card"
          accessibilityLabel="opção cartão de credito">
          Cartão de Crédito
        </Checkbox>

        <Checkbox
          _icon={{ color: 'white' }}
          _checked={{
            bg: 'blueLight',
            borderColor: 'blueLight',
            _pressed: { borderColor: 'blueLight', bg: 'blue' },
          }}
          _text={{ fontSize: 'md' }}
          size="md"
          my={1}
          value="deposit"
          accessibilityLabel="opção depósito bancário">
          Depósito Bancário
        </Checkbox>
      </Checkbox.Group>
    </VStack>
  );
}
