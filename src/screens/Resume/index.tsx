import React, { useEffect, useState, useCallback } from 'react';
import { HistoryCard } from '../../components/HistoryCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native'
import { ActivityIndicator } from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadContainer
} from './styles';
import { categories } from '../../utils/categories';
import { RFValue } from 'react-native-responsive-fontsize';
import theme from '../../global/styles/theme';
import { subMonths, addMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';

interface TransactionsData {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percentFormatted: string;
  percent: number;
}

export function Resume() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectDate, setSelectDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

  function handleDateChancge(action: 'next' | 'prev'){

    setLoading(true);

    if(action === 'next'){
      setSelectDate(addMonths(selectDate, 1));
    } else {
      setSelectDate(subMonths(selectDate, 1));
    }
  }

  async function loadData() {
    const dataKey = `@gofinances:transctions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expensives = responseFormatted
    .filter((expensive: TransactionsData) =>
      expensive.type === 'negative' &&
      new Date(expensive.date).getMonth() === selectDate.getMonth() &&
      new Date(expensive.date).getFullYear() === selectDate.getFullYear()
    );

    const expensivesTotal = expensives
    .reduce((accumulator: number, expensive: TransactionsData) => {
      return accumulator + Number(expensive.amount);
    },0);

    const totalByCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach((expensive: TransactionsData) => {
        if(expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });

      if(categorySum > 0){
        const totalFormatted = categorySum
        .toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })

        const percent = (categorySum / expensivesTotal * 100);
        const percentFormatted = `${percent.toFixed(0)}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total: categorySum,
          totalFormatted,
          percent,
          percentFormatted,
        })
      }
    })

    console.log(totalByCategory);
    setTotalByCategories(totalByCategory);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [selectDate]);

  useFocusEffect(useCallback(
    () => {
      loadData();
    },
    [],
  ));

  return (
  <Container>
    <Header>
      <Title>
      {'Resumo'}
      </Title>
    </Header>

    {
      loading ?
      <LoadContainer>
        <ActivityIndicator
          color={theme.colors.primary}
          size="large"
        />
      </LoadContainer> :
      <>
        <ChartContainer>
            <MonthSelect>
              <MonthSelectButton onPress={() => handleDateChancge('prev')}>
                <MonthSelectIcon name="chevron-left"/>
              </MonthSelectButton>

              <Month>
                { format(selectDate, 'MMMM, yyyy',{locale: ptBR})}
              </Month>

              <MonthSelectButton onPress={() => handleDateChancge('next')}>
              <MonthSelectIcon name="chevron-right"/>
              </MonthSelectButton>
            </MonthSelect>

          <VictoryPie
            // padding={100}
            colorScale={totalByCategories.map(category => category.color)}
            data={totalByCategories}
            style={{
              labels: {
                fontSize: RFValue(12),
                fontWeight: 'bold',
                fill: theme.colors.shape
              }
            }}
            labelRadius={100}
            x={"percentFormatted"}
            y="total"
          />
        </ChartContainer>

        <Content>
          { totalByCategories.map(item => (
              <HistoryCard
              key={item.key}
              title={item.name}
              amount={item.totalFormatted}
              color={item.color}
            />
          ))
          }
        </Content>
      </>
    }
  </Container>
  );
};
