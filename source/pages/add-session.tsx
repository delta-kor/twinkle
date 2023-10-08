import spinners from 'cli-spinners';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { Task, TaskList } from 'ink-task-list';
import { UncontrolledTextInput } from 'ink-text-input';
import React, { useEffect, useState } from 'react';
import TwinkleManager from '../services/twinkle.js';

interface Props {
  router: Router;
  state: RouterState;
}

interface RouterState {
  twinkle: Twinkle;
}

enum PageState {
  DateInput,
  ProgramSelect,
  Proceed,
}

const AddSessionPage: React.FC<Props> = ({ router, state }) => {
  const [twinkle, setTwinkle] = useState<Twinkle | null>(null);
  const [pageState, setPageState] = useState<PageState>(PageState.DateInput);
  const [date, setDate] = useState<string | null>(null);
  const [program, setProgram] = useState<Program | null>(null);

  useEffect(() => {
    state && setTwinkle(state.twinkle);
  }, [state]);

  useInput(() => {
    if (pageState === PageState.Proceed) {
      setDate(null);
      setProgram(null);
      setPageState(PageState.DateInput);
    }
  });

  const getState = (target: PageState): any => {
    if (pageState > target) return 'success';
    if (pageState === target) return 'loading';
    if (pageState < target) return 'pending';
    return 'pending';
  };

  const handleDateInput = (value: string) => {
    if (!value.trim()) return router('twinkle', { id: twinkle?.id });

    setDate(value);
    setPageState(PageState.ProgramSelect);
  };

  const handleProgramSelect = async (item: SelectItem) => {
    if (item.value === 'cancel') return router('twinkle', { id: twinkle?.id });

    const updatedTwinkle = await TwinkleManager.addSession(twinkle!, date!, item.value as any);

    setProgram(item.value as any);
    setPageState(PageState.Proceed);
    setTwinkle(updatedTwinkle);
  };

  const menuItems: SelectItem[] = [
    { label: '- 엠카운트다운', value: 'mcountdown' },
    { label: '- 뮤직뱅크', value: 'musicbank' },
  ];
  menuItems.push({ label: '> Cancel', value: 'cancel' });

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
        Add session | Twinkle
      </Text>

      <Box flexDirection="column" borderStyle="single" paddingX={1}>
        {twinkle.sessions.map(session => (
          <Box key={session.id} gap={1}>
            <Text color={'gray'}>{session.id}</Text>
            <Text>{session.date}</Text>
            <Text color={'blue'}>{session.program}</Text>
          </Box>
        ))}
      </Box>

      <Box gap={2}>
        <Box minWidth={24}>
          <TaskList>
            <Task
              label={`Date ${date ? `> ${date}` : ''}`}
              state={getState(PageState.DateInput)}
              spinner={spinners.line}
            />
            <Task
              label={`Program ${program ? `> ${program}` : ''}`}
              state={getState(PageState.ProgramSelect)}
              spinner={spinners.line}
            />
          </TaskList>
        </Box>

        {pageState === PageState.DateInput && (
          <Box flexDirection="column">
            <Text color={'yellow'}>Enter date</Text>
            <UncontrolledTextInput onSubmit={handleDateInput} />
          </Box>
        )}

        {pageState === PageState.ProgramSelect && (
          <Box flexDirection="column">
            <Text color={'yellow'}>Select artist</Text>
            <SelectInput items={menuItems} onSelect={handleProgramSelect} />
          </Box>
        )}

        {pageState === PageState.Proceed && (
          <Box flexDirection="column">
            <Text color={'blue'}>Data saved</Text>
            <Text color={'gray'}>Press any key to continue...</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AddSessionPage;
