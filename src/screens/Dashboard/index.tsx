import React, { useCallback, useState } from 'react';
import { useEffect } from 'react';
import { HighlightCard } from '../../components/HighlightCard';
import { HighlightCards } from '../../components/HighlightCard/styles';
import {TransactionCard, TransactionsCardProps} from '../../components/TransactionCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Container,
  Header,
  Icon,
  Photo,
  Title,
  Transactions,
  User,
  UserGreeting,
  UserInfo,
  UserName,
  UserWrapper,
  TransactionList,
  LogoutButton,
  LoadContainer
} from './styles';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import theme from '../../global/styles/theme';
import { useAuth } from '../../hooks/auth';
import { signOutAsync } from 'expo-apple-authentication';

export interface DataListProps extends TransactionsCardProps {
  id: string;
}

interface HighlightProps {
  total: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  amountTotal: HighlightProps;
}

export function Dashboard(){
  const {user, signOut} = useAuth();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);


  async function loadTransactions() {
    const dataKey = `@gofinances:transctions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    function getLastTransactionDate(
      collection: DataListProps[],
      type: 'positive' | 'negative'
    ) {

      const collectionFilttered = collection
        .filter(transaction => transaction.type === type);

      if(collectionFilttered.length === 0)
        return 0;

      const lastTransaction = new Date(Math.max.apply(
        Math, collection
        .map(transaction => new Date(transaction.date).getTime())
      ))

      return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', {month: 'long'})}`;
    }

    const transactionsFormatted: DataListProps[] = transactions
      .map((item: DataListProps) => {

        if(item.type === 'positive'){
          entriesTotal += Number(item.amount);
        } else {
          expensiveTotal += Number(item.amount);
        }

        const amount = Number(item.amount)
        .toLocaleString('pt-BR',{
          style: 'currency',
          currency: 'BRL'
        });

        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: "2-digit"
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date,
        }
      });

      setTransactions(transactionsFormatted);

      const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
      const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative');
      const totalInterval = lastTransactionExpensives === 0
      ? 'n??o h?? transa????es'
      : `01 a ${lastTransactionExpensives}`;

      const total = entriesTotal - expensiveTotal;

      setHighlightData({
        entries: {
          total: entriesTotal.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }),
            lastTransaction: lastTransactionEntries === 0
                ? 'n??o h?? transa????es'
                : `ultima entrada ${lastTransactionEntries}`,

        },
        expensives: {
          total: expensiveTotal.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }),
            lastTransaction: lastTransactionExpensives === 0
            ? 'n??o h?? transa????es'
            : `ultima sa??da ${lastTransactionExpensives}`,
        }
        ,
        amountTotal: {
          total: total.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
          }),
          lastTransaction: totalInterval,
         },
      });
      setLoading(false);
  }

  useEffect( () => {
    loadTransactions();
  }, []);

  useFocusEffect(useCallback(
    () => {
      loadTransactions();
    },
    [],
  ));

  return(
    <Container>
      {
        loading ?
        <LoadContainer>
          <ActivityIndicator
            color={theme.colors.primary}
            size="large"
          />
        </LoadContainer> : <>
                            <Header>
                              <UserWrapper>
                                <UserInfo>
                                  <Photo
                                    source={{uri: user.photo}}
                                  />

                                  <User>
                                    <UserGreeting>Ol??,</UserGreeting>
                                    <UserName>{user.name} </UserName>
                                  </User>
                                </UserInfo>

                                <LogoutButton onPress={signOut}>
                                  <Icon name="power" />
                                </LogoutButton>

                              </UserWrapper>
                            </Header>

                            <HighlightCards>
                              <HighlightCard
                                type="up"
                                title="Entrada"
                                amount={highlightData.entries.total}
                                lastTransaction={highlightData.entries.lastTransaction}
                              />

                              <HighlightCard
                                type="down"
                                title="Sa??da"
                                amount={highlightData.expensives.total}
                                lastTransaction={highlightData.expensives.lastTransaction}
                              />

                              <HighlightCard
                                type="total"
                                title={"Total"}
                                amount={highlightData.amountTotal.total}
                                lastTransaction={highlightData.amountTotal.lastTransaction}
                              />
                            </HighlightCards>

                            <Transactions>
                              <Title>Listagem</Title>

                              <TransactionList
                                data={transactions}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => <TransactionCard data={item}/>}
                              />
                            </Transactions>
                          </>
      }
    </Container>
  )
}

