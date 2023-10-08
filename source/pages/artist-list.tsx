import { Box, Text, useInput } from 'ink';
import React from 'react';
import Artists from '../services/artist.js';

interface Props {
  router: Router;
}

const ArtistListPage: React.FC<Props> = ({ router }) => {
  useInput(() => {
    router('main');
  });

  return (
    <Box flexGrow={1} flexDirection="column" gap={1}>
      <Text bold color={'blue'}>
        Artist List | Twinkle
      </Text>
      <Box flexDirection="column">
        {Artists.map(artist => (
          <Box key={artist.id} flexDirection="row" gap={1}>
            <Box width={6}>
              <Text wrap="truncate" color={'gray'}>
                {artist.id}
              </Text>
            </Box>
            <Box width={8}>
              <Text wrap="truncate" color={'yellow'}>
                {artist.type}
              </Text>
            </Box>
            <Box flexGrow={1}>
              <Text wrap="truncate">{artist.name}</Text>
            </Box>
            {artist.type === 'group' && (
              <Box flexDirection="row" gap={1}>
                {artist.members.map(member => (
                  <Text key={member} color={'green'}>
                    {member}
                  </Text>
                ))}
              </Box>
            )}
          </Box>
        ))}
      </Box>
      <Text color={'gray'}>Press any key to continue...</Text>
    </Box>
  );
};

export default ArtistListPage;
