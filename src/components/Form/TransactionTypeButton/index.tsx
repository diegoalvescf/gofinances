import  React  from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';

const IconProps = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle'
}

interface TransactionProps<IconProps> {
  type: 'up' | 'down';
}

import { Container, Title, Icon, Button } from './styles';

interface TransactionTypeButtonProps extends RectButtonProps {
  type: 'up' | 'down';
  title: string;
  isActive: boolean;
}

export function TransactionTypeButton({ title, type, isActive, ...rest }: TransactionTypeButtonProps) {
  return (
    <Container 
      isActive={isActive}
      type={type}
      
    >
      <Button
        {...rest} 
      >
        <Icon name={IconProps[type]} type={type}/>
          <Title>
            {title}
          </Title>
      </Button>
    </Container>
  );
};