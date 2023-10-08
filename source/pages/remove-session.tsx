import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import React, { useEffect, useState } from 'react';
import TwinkleManager from '../services/twinkle.js';

interface Props {
  router: Router;
  state: RouterState;
}

interface RouterState {
  twinkle: Twinkle;
}

const RemoveSessionPage: React.FC<Props> = ({ router, state }) => {
  const [twinkle, setTwinkle] = useState<Twinkle | null>(null);

  useEffect(() => {
    state && setTwinkle(state.twinkle);
  }, [state]);

  if (!twinkle)
    return (
      <Box flexDirection="column" gap={1}>
        <Text bold color={'gray'}>
          Loading...
        </Text>
      </Box>
    );

  const menuItems: SelectItem[] = twinkle.sessions.map(item => ({
    label: item.id,
    value: item.id,
  }));
  menuItems.push({ label: '> Cancel', value: 'cancel' });

  const createItemComponent: React.FC<{ label: string; isSelected?: boolean }> = ({
    label,
    isSelected,
  }) => {
    const session = twinkle.sessions.find(item => item.id === label);

    if (label === 'cancel' || !session)
      return <Text color={isSelected ? 'blue' : undefined}>{'>'} Cancel</Text>;

    return (
      <Box key={session.id} flexDirection="row" gap={1}>
        <Text>-</Text>
        <Box width={10}>
          <Text wrap="truncate" color={'gray'}>
            {session.id}
          </Text>
        </Box>
        <Box width={8}>
          <Text wrap="truncate">{session.date}</Text>
        </Box>
        <Box flexGrow={1}>
          <Text wrap="truncate" color={'yellow'}>
            {session.program}
          </Text>
        </Box>
      </Box>
    );
  };

  const handleSelect = async (item: SelectItem) => {
    if (item.value === 'cancel') return router('twinkle', { id: twinkle.id });
    const updatedTwinkle = await TwinkleManager.removeSession(twinkle, item.value);
    setTwinkle(updatedTwinkle);
    router('twinkle', { id: twinkle.id });
  };

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color={'blue'}>
        Add session | Twinkle
      </Text>

      <SelectInput items={menuItems} itemComponent={createItemComponent} onSelect={handleSelect} />
    </Box>
  );
};

export default RemoveSessionPage;
