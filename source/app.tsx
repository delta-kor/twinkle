import { Box, Spacer, Text } from 'ink';
import React, { useState } from 'react';
import AddGuidePage from './pages/AddGuide.js';
import AddMusicPage from './pages/AddMusic.js';
import AddSessionPage from './pages/AddSession.js';
import ArtistListPage from './pages/ArtistList.js';
import MainPage from './pages/Main.js';
import RemoveSessionPage from './pages/RemoveSession.js';
import TwinklePage from './pages/Twinkle.js';
import TwinkleListPage from './pages/TwinkleList.js';

const App: React.FC = () => {
  const [page, setPage] = useState<PageName>('main');
  const [pageState, setPageState] = useState<any>(null);

  const router = (page: PageName, state = null): void => {
    setPageState(state);
    setPage(page);
  };

  return (
    <Box flexDirection="column" padding={1}>
      {page === 'main' && <MainPage router={router} />}
      {page === 'artist_list' && <ArtistListPage router={router} />}
      {page === 'add_music' && <AddMusicPage router={router} />}
      {page === 'twinkle_list' && <TwinkleListPage router={router} />}
      {page === 'twinkle' && <TwinklePage router={router} state={pageState} />}
      {page === 'add_session' && <AddSessionPage router={router} state={pageState} />}
      {page === 'remove_session' && <RemoveSessionPage router={router} state={pageState} />}
      {page === 'add_guide' && <AddGuidePage router={router} state={pageState} />}
      {page === 'exit' && <Text>App closed</Text>}
      <Spacer />
    </Box>
  );
};

export default App;
