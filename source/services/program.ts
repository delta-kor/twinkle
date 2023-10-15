export interface ProgramData {
  key: Program;
  searchName: string;
  channelId: string;
  mainId: string;
}

const ProgramMap: Map<Program, ProgramData> = new Map();
ProgramMap.set('mcountdown', {
  key: 'mcountdown',
  searchName: '엠카운트다운',
  channelId: 'UCTQVIXvcHrR9jYoJ6qaBAow',
  mainId: 'UCbD8EppRX3ZwJSou-TVo90A',
});
ProgramMap.set('musicbank', {
  key: 'musicbank',
  searchName: '뮤직뱅크',
  channelId: 'UCeLPm9yH_a_QH8n6445G-Ow',
  mainId: 'UCeLPm9yH_a_QH8n6445G-Ow',
});
ProgramMap.set('musiccore', {
  key: 'musiccore',
  searchName: '음악중심',
  channelId: 'UCe52oeb7Xv_KaJsEzcKXJJg',
  mainId: 'UCe52oeb7Xv_KaJsEzcKXJJg',
});
ProgramMap.set('inkigayo', {
  key: 'inkigayo',
  searchName: '인기가요',
  channelId: 'UCM3jwNRfl5-W8VzgT6DsaEQ',
  mainId: 'UCS_hnpJLQTvBkqALgapi_4g',
});
ProgramMap.set('theshow', {
  key: 'theshow',
  searchName: '더쇼',
  channelId: 'UCoRXPcv8XK5fAplLbk9PTww',
  mainId: 'UCoRXPcv8XK5fAplLbk9PTww',
});
ProgramMap.set('showchampion', {
  key: 'showchampion',
  searchName: 'Show Champion',
  channelId: 'UCPde4guD9yFBRzkxk2PatoA',
  mainId: 'UCPde4guD9yFBRzkxk2PatoA',
});

export default function Program(key: Program): ProgramData {
  return ProgramMap.get(key)!;
}
