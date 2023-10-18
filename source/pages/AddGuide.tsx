import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import React, { useState } from 'react';
import TwinkleManager from '../services/twinkle.js';

interface Props {
  router: Router;
  state: RouterState;
}

interface RouterState {
  twinkle: Twinkle;
}

const AddGuidePage: React.FC<Props> = ({ router, state }) => {
  const [value, setValue] = useState<string>(state.twinkle?.guideId || '');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (value: string) => {
    if (!value) router('twinkle', { id: state.twinkle.id });

    setLoading(true);
    await TwinkleManager.addGuide(state.twinkle, value);
    setLoading(false);

    router('twinkle', { id: state.twinkle.id });
  };

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color={'blue'}>
        Add guide | Twinkle
      </Text>

      {loading ? (
        <Text bold color={'gray'}>
          Downloading...
        </Text>
      ) : (
        <TextInput value={value} onChange={setValue} onSubmit={handleSubmit} />
      )}
    </Box>
  );
};

export default AddGuidePage;
