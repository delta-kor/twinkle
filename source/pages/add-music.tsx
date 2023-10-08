import { Box, Text } from 'ink';
import React from 'react';

interface Props {
  router: Router;
}

const AddMusicPage: React.FC<Props> = () => {
  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color={'blue'}>
        Artist List | Add Music
      </Text>
    </Box>
  );
};

export default AddMusicPage;
