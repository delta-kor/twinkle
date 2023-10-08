import { Box, Spacer, Text } from 'ink';
import React, { useState } from 'react';
import AddMusicPage from './pages/add-music.js';
import ArtistListPage from './pages/artist-list.js';
import MainPage from './pages/main.js';

const App: React.FC = () => {
  const [page, setPage] = useState<PageName>('main');

  const router = (page: PageName): void => {
    setPage(page);
  };

  return (
    <Box flexDirection="column" padding={1}>
      {page === 'main' && <MainPage router={router} />}
      {page === 'artist_list' && <ArtistListPage router={router} />}
      {page === 'add_music' && <AddMusicPage router={router} />}
      {page === 'exit' && <Text>App closed</Text>}
      <Spacer />
    </Box>
  );
};

export default App;
