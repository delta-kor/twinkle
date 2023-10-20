import { Box, Text } from 'ink';
import React from 'react';

interface Props {
  tag: VideoTag | null;
  state: VideoState;
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

const StateMap: Map<VideoState, string> = new Map();
StateMap.set('unloaded', 'red');
StateMap.set('loading', 'gray');
StateMap.set('waving', 'yellow');
StateMap.set('loaded', 'green');
StateMap.set('plotted', 'blue');

const Tag: React.FC<Props> = ({ tag, state }) => {
  const color = TagMap.get(tag) || ['UK', 'red'];
  const stateFigure = StateMap.get(state)!;

  return (
    <Box gap={1}>
      <Text color={color[1]} bold>
        {color[0]}
      </Text>
      <Text backgroundColor={stateFigure}> </Text>
    </Box>
  );
};

export default Tag;
