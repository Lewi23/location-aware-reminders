import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

import Providers from './navigation';

export default function App() {
  return (
  <PaperProvider>
    <Providers />
  </PaperProvider>
  )
}
