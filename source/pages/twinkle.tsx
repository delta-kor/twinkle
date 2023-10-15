import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import React, { useEffect, useState } from 'react';
import Tag from '../components/tag.js';
import TwinkleManager from '../services/twinkle.js';

interface Props {
  router: Router;
  state: PageState;
}

interface PageState {
  id: string;
}

const TwinklePage: React.FC<Props> = ({ router, state }) => {
  const twinkleId = state?.id;

  const [twinkle, setTwinkle] = useState<Twinkle | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadTwinkle();
  }, []);

  const loadTwinkle = async () => {
    const twinkle = await TwinkleManager.getTwinkleById(twinkleId);
    setTwinkle(twinkle);
  };

  const selectItems: SelectItem[] = [
    { label: '- Add session', value: 'add_session' },
    { label: '- Remove session', value: 'remove_session' },
    { label: '- Load sessions', value: 'load_sessions' },
    { label: '- Reset sessions', value: 'reset_sessions' },
    { label: '> Cancel', value: 'cancel' },
  ];

  const handleSelect = async (item: SelectItem) => {
    if (item.value === 'cancel') return router('twinkle_list');
    if (item.value === 'add_session') return router('add_session', { twinkle });
    if (item.value === 'remove_session') return router('remove_session', { twinkle });
    if (item.value === 'load_sessions') {
      setLoading(true);
      const updatedTwinkle = await TwinkleManager.loadSessions(twinkle!, (twinkle: Twinkle) =>
        setTwinkle({ ...twinkle })
      );
      setTwinkle({ ...updatedTwinkle });
      setLoading(false);
    }
    if (item.value === 'reset_sessions') {
      const updatedTwinkle = await TwinkleManager.resetSessions(twinkle!);
      setTwinkle({ ...updatedTwinkle });
    }
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
    <Box>
      <Box flexDirection="column" gap={1} flexGrow={1}>
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
          <Box>
            <Box width={14}>
              <Text bold color={'gray'}>
                Sessions
              </Text>
            </Box>
            <Text>{twinkle.sessions.length} item(s)</Text>
          </Box>
        </Box>
        <Box flexDirection="column">
          {twinkle.sessions.map(session => (
            <Box key={session.id} gap={1}>
              <Box minWidth={19} gap={1}>
                <Box minWidth={6}>
                  <Text color={'yellow'}>{session.date}</Text>
                </Box>
                <Text color={'blue'}>{session.program}</Text>
              </Box>
              <Box columnGap={1} flexWrap="wrap">
                {session.segments.map((segment, index) => (
                  <Box key={index} gap={1} minWidth={16}>
                    <Text>{segment.type === 'full' ? '전체' : segment.member}</Text>
                    <Box gap={1}>
                      {segment.videos.map(video => (
                        <Tag key={video.id} tag={video.tag} />
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box flexShrink={0} width={18}>
        {!loading && <SelectInput items={selectItems} onSelect={handleSelect} />}
      </Box>
    </Box>
  );
};

export default TwinklePage;
