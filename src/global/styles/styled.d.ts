import 'styled-components';
import theme from './theme';

declare module 'styled-components'{
  type ThemeType = typeof theme

  export interface DefaultTheme extends ThemeType {}
}

// Aqui foi criado um tipo, onde esse tipo (typeof) informamos que é do tipo theme 
// esse processo é para tipar o nosso tema para usar em toda aplicação assim tendo as
// sugestões das cores que o tema possui 