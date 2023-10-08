import { Box, Text } from 'ink';
import React, { useEffect, useState } from 'react';
import TwinkleManager from '../services/twinkle.js';

interface Props {
  router: Router;
  state: PageState;
}

interface PageState {
  id: string;
}

const TwinklePage: React.FC<Props> = ({ router, state }) => {
  const twinkleId = state.id;

  const [twinkle, setTwinkle] = useState<Twinkle | null>(null);

  useEffect(() => {
    loadTwinkle();
  });

  const loadTwinkle = async () => {
    const twinkle = await TwinkleManager.getTwinkleById(twinkleId);
    setTwinkle(twinkle);
  };

  if (!twinkle)
    return (
      <Box flexDirection="column" gap={1}>
        <Text bold color={'gray'}>
          Loading...
        </Text>
      </Box>
    );

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color={'blue'}>
        Twinkle Info | Twinkle
      </Text>
      <Box flexDirection="column">
        <Box>
          <Box width={14}>
            <Text bold color={'gray'}>
              Id
            </Text>
          </Box>
          <Text>{twinkle.id}</Text>
        </Box>
        <Box>
          <Box width={14}>
            <Text bold color={'gray'}>
              Artist Id
            </Text>
          </Box>
          <Text>{twinkle.artist.id}</Text>
        </Box>
        <Box>
          <Box width={14}>
            <Text bold color={'gray'}>
              Artist Name
            </Text>
          </Box>
          <Text>{twinkle.artist.name}</Text>
        </Box>
        <Box>
          <Box width={14}>
            <Text bold color={'gray'}>
              Members
            </Text>
          </Box>
          {twinkle.artist.type === 'group' ? (
            <Box gap={1}>
              {twinkle.artist.members.map(member => (
                <Text key={member}>{member}</Text>
              ))}
            </Box>
          ) : (
            <Text>Solo</Text>
          )}
        </Box>
        <Box>
          <Box width={14}>
            <Text bold color={'gray'}>
              Music Title
            </Text>
          </Box>
          <Text>{twinkle.music}</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default TwinklePage;
