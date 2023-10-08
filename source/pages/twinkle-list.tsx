import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import React, { useEffect, useState } from 'react';
import TwinkleManager from '../services/twinkle.js';

interface Props {
  router: Router;
}

const TwinkleListPage: React.FC<Props> = ({ router }) => {
  const [twinkles, setTwinkles] = useState<Twinkle[]>([]);

  const loadTwinkles = async () => {
    const twinkles = await TwinkleManager.getTwinkleList();
    setTwinkles(twinkles);
  };

  useEffect(() => {
    loadTwinkles();
  }, []);

  const items: SelectItem[] = twinkles.map(item => ({ label: item.id, value: item.id }));
  items.push({ label: 'cancel', value: 'cancel' });

  const createItemComponent: React.FC<{ label: string; isSelected?: boolean }> = ({
    label,
    isSelected,
  }) => {
    if (label === 'cancel')
      return <Text color={isSelected ? 'blue' : undefined}>{'>'} Cancel</Text>;

    const twinkle = twinkles.find(item => item.id === label)!;
    return (
      <Box key={twinkle.id} flexDirection="row" gap={1}>
        <Text>-</Text>
        <Box width={10}>
          <Text wrap="truncate" color={'gray'}>
            {twinkle.id}
          </Text>
        </Box>
        <Box width={16}>
          <Text wrap="truncate">
            {twinkle.artist.name} ({twinkle.artist.id})
          </Text>
        </Box>
        <Box flexGrow={1}>
          <Text wrap="truncate" color={'yellow'}>
            {twinkle.music}
          </Text>
        </Box>
      </Box>
    );
  };

  const handleSelect = (item: SelectItem) => {
    if (item.value === 'cancel') return router('main');
    return router('twinkle', { id: item.value });
  };

  return (
    <Box flexGrow={1} flexDirection="column" gap={1}>
      <Text bold color={'blue'}>
        Artist List | Twinkle
      </Text>
      <Box flexDirection="column">
        <SelectInput items={items} itemComponent={createItemComponent} onSelect={handleSelect} />
        {twinkles.length === 0 && (
          <Box>
            <Text color={'gray'}>No data available</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TwinkleListPage;
