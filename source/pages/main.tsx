import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import React from 'react';

interface Props {
  router: Router;
}

const MainPage: React.FC<Props> = ({ router }) => {
  const handleSelect = (item: SelectItem) => {
    if (item.value === 'artist_list') router('artist_list');
  };

  const menuItems: SelectItem[] = [
    { label: 'Artist List', value: 'artist_list' },
    { label: 'Music List', value: 'music_list' },
  ];

  return (
    <Box flexDirection="column">
      <Text bold color={'yellow'}>
        Twinkle
      </Text>
      <SelectInput items={menuItems} onSelect={handleSelect} />
    </Box>
  );
};

export default MainPage;
