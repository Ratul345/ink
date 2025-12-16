import { Appearance, ColorSchemeName } from 'react-native';

export type Theme = {
  background: string;
  text: string;
  secondaryText: string;
  border: string;
  placeholder: string;
  accent: string;
  destructive: string;
};

const lightTheme: Theme = {
  background: '#ffffff',
  text: '#000000',
  secondaryText: '#666666',
  border: '#e0e0e0',
  placeholder: '#999999',
  accent: '#007AFF',
  destructive: '#ff4444',
};

const darkTheme: Theme = {
  background: '#000000',
  text: '#ffffff',
  secondaryText: '#666666',
  border: '#333333',
  placeholder: '#666666',
  accent: '#007AFF',
  destructive: '#ff4444',
};

export const getTheme = (colorScheme: ColorSchemeName): Theme => {
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};

export const getCurrentTheme = (): Theme => {
  const colorScheme = Appearance.getColorScheme();
  return getTheme(colorScheme);
};

export const subscribeToThemeChanges = (callback: (theme: Theme) => void) => {
  const subscription = Appearance.addChangeListener(({ colorScheme }) => {
    callback(getTheme(colorScheme));
  });
  
  return () => subscription.remove();
};