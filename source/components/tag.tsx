import { Box, Text } from 'ink';
import React from 'react';

interface Props {
  tag: VideoTag | null;
}

const TagMap: Map<VideoTag | null, [string, string]> = new Map();
TagMap.set('single_face', ['FA', 'cyan']);
TagMap.set('single_full', ['FL', 'green']);
TagMap.set('full', ['FL', 'green']);
TagMap.set('full_hd', ['FH', 'green']);
TagMap.set('1take', ['1T', 'magenta']);
TagMap.set('tower', ['TW', 'magenta']);
TagMap.set('side', ['SD', 'magenta']);
TagMap.set('live', ['LV', 'magenta']);
TagMap.set('rehearsal', ['RH', 'magenta']);
TagMap.set('main', ['MN', 'red']);
TagMap.set(null, ['UK', 'red']);

const Tag: React.FC<Props> = ({ tag }) => {
  const color = TagMap.get(tag) || ['UK', 'red'];

  return (
    <Box>
      <Text color={color[1]} bold>
        {color[0]}
      </Text>
    </Box>
  );
};

export default Tag;
