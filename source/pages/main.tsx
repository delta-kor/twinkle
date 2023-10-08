import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import React from 'react';

interface Props {
  router: Router;
}

const MainPage: React.FC<Props> = ({ router }) => {
  const handleSelect = (item: SelectItem) => {
    router(item.value as PageName);
  };

  const menuItems: SelectItem[] = [
    { label: '- Artist List', value: 'artist_list' },
    { label: '- Add Music', value: 'add_music' },
    { label: '- Twinkle List', value: 'twinkle_list' },
    { label: '> Exit', value: 'exit' },
  ];

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color={'yellow'}>
        Twinkle
      </Text>
      <SelectInput items={menuItems} onSelect={handleSelect} />
    </Box>
  );
};

export default MainPage;
