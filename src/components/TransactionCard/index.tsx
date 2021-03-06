import React from 'react';
import { categories } from '../../utils/categories';

import { 
  Amount, 
  Category, 
  CategoryName, 
  Container, 
  Footer, 
  Icon, 
  Title, 
  Date 
} from './styles';

export interface TransactionsCardProps {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface TransactionPops{
  data: TransactionsCardProps;
}

export function TransactionCard({ data }: TransactionPops){
  const [ category ] = categories.filter(
    item => item.key === data.category
  );

  return (
    <Container>
      <Title>
        {data.name}
      </Title>
     
      <Amount type={data.type}>
        { data.type === 'negative' && '- '}
        { data.amount }
      </Amount>
      
      <Footer>
        <Category>
          <Icon name={category.icon}/>
        
          <CategoryName> 
            {category.name} 
          </CategoryName>
        </Category> 

        <Date>
          {data.date}
        </Date>
      </Footer>
      
    </Container>
  );
};
