import { Box, Text } from 'ink';
import React, { useState } from 'react';
import MainPage from './pages/main.js';

const App: React.FC = () => {
  const [page, setPage] = useState<PageName>('main');

  const router = (page: PageName): void => {
    setPage(page);
  };

  return (
    <Box borderStyle="single" paddingX={1}>
      {page === 'main' && <MainPage router={router} />}
      {page === 'artist_list' && <Text>d</Text>}
    </Box>
  );
};

export default App;
