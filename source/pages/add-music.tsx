import spinners from 'cli-spinners';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { Task, TaskList } from 'ink-task-list';
import { UncontrolledTextInput } from 'ink-text-input';
import React, { useState } from 'react';
import Artists from '../services/artist.js';
import TwinkleManager from '../services/twinkle.js';

interface Props {
  router: Router;
}

enum PageState {
  ArtistInput,
  MusicTitleInput,
  Proceed,
}

const AddMusicPage: React.FC<Props> = ({ router }) => {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [musicTitle, setMusicTitle] = useState<string | null>(null);
  const [pageState, setPageState] = useState<PageState>(PageState.ArtistInput);

  useInput(() => {
    if (pageState === PageState.Proceed) router('main');
  });

  const handleArtistSelect = (item: SelectItem) => {
    const artist = Artists.find(artist => artist.id === item.value);
    if (!artist) return router('main');

    setArtist(artist);
    setPageState(PageState.MusicTitleInput);
  };

  const handleMusicTitleInput = (value: string) => {
    if (!value.trim()) return router('main');

    setMusicTitle(value);
    setPageState(PageState.Proceed);
    TwinkleManager.createTwinkle(artist!, value);
  };

  const menuItems: SelectItem[] = Artists.map(artist => ({
    label: `- ${artist.name}`,
    value: artist.id,
  }));
  menuItems.push({ label: '> Cancel', value: 'cancel' });

  const getState = (target: PageState): any => {
    if (pageState > target) return 'success';
    if (pageState === target) return 'loading';
    if (pageState < target) return 'pending';
    return 'pending';
  };

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color={'blue'}>
        Add Music | Twinkle
      </Text>

      <TaskList>
        <Task
          label={`Artist ${artist ? `> ${artist.name}` : ''}`}
          state={getState(PageState.ArtistInput)}
          spinner={spinners.line}
        />
        <Task
          label={`Music Title ${musicTitle ? `> ${musicTitle}` : ''}`}
          state={getState(PageState.MusicTitleInput)}
          spinner={spinners.line}
        />
      </TaskList>

      {pageState === PageState.ArtistInput && (
        <Box flexDirection="column">
          <Text color={'yellow'}>Select artist</Text>
          <SelectInput items={menuItems} onSelect={handleArtistSelect} />
        </Box>
      )}

      {pageState === PageState.MusicTitleInput && (
        <Box flexDirection="column">
          <Text color={'yellow'}>Enter music title</Text>
          <UncontrolledTextInput onSubmit={handleMusicTitleInput} />
        </Box>
      )}

      {pageState === PageState.Proceed && (
        <Box flexDirection="column">
          <Text color={'blue'}>Data saved</Text>
          <Text color={'gray'}>Press any key to continue...</Text>
        </Box>
      )}
    </Box>
  );
};

export default AddMusicPage;
