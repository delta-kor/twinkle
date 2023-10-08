import { Box, Text, useInput } from 'ink';
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

  useInput(() => {
    router('main');
  });

  return (
    <Box flexGrow={1} flexDirection="column" gap={1}>
      <Text bold color={'blue'}>
        Artist List | Twinkle
      </Text>
      <Box flexDirection="column">
        {twinkles.map(twinkle => (
          <Box key={twinkle.id} flexDirection="row" gap={1}>
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
        ))}
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
