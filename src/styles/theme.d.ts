import 'styled-components';

interface ChartColors {
  barPrimary: string;
  barSecondary: string;
}

export interface Theme {
  background: string;
  text: string;
  primary: string;
  cardBg: string;
  borderColor: string;
  subtitle: string;
  chart: ChartColors;
  iconActive: string;
  pageBackground: string;
}

// Esto es necesario para que styled-components reconozca nuestra Theme interface
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

export const lightTheme: Theme;
export const darkTheme: Theme;