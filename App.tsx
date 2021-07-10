import React from 'react';
import {StatusBar} from 'react-native';
import 'react-native-gesture-handler';
import { ThemeProvider } from 'styled-components';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import theme from './src/global/styles/theme';
import AppLoading from 'expo-app-loading';
import { AuthProvider, useAuth } from './src/hooks/auth';
import { Routes } from './src/routes';

export default function App() {
  const [fontsLoaded] = useFonts({ // o fontsLoaded vai ser usado para o carregamento das fontes, e enquanto ele não carregar seguramos na tela de splash
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  const { userLoading } = useAuth();

  if(!fontsLoaded || userLoading){
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle="light-content" />

        <AuthProvider>
          <Routes />
        </AuthProvider>
    </ThemeProvider>
  );
}
