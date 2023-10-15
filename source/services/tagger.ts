import { ProgramData } from './program.js';

export default class Tagger {
  public static tagVideo(
    video: YoutubeVideo,
    program: ProgramData,
    isGroup: boolean
  ): VideoTag | null {
    const title = video.title.toLowerCase().replace(/ /g, '');

    if (program.key === 'mcountdown') {
      if (title.includes('1위앵콜직캠') && isGroup) return 'live';
      if (title.startsWith('[mpd직캠')) return isGroup ? 'full' : 'single_full';
      if (title.startsWith('[입덕직캠') && !isGroup) return 'single_face';
      if (title.includes('#엠카운트다운ep') && isGroup) return 'main';
      if (title.includes('KPOP TV Show') && isGroup) return 'main';
    }

    if (program.key === 'musicbank') {
      if (title.startsWith('[k-choreo') && isGroup) return 'full';
      if (title.startsWith('[사운드360') && isGroup) return 'full';
      if (title.startsWith('[뮤뱅원테이크') && isGroup) return '1take';
      if (title.startsWith('[k-choreotowercam') && isGroup) return 'tower';
      if (title.startsWith('[k-fancam') && !isGroup) return 'single_full';
      if (title.startsWith('[얼빡직캠') && !isGroup) return 'single_face';
      if (title.includes('뮤직뱅크1위앵콜') && isGroup) return 'live';
      if (title.includes('풀캠ver') && isGroup) return 'full';
      if (title.includes('뮤직뱅크직캠') && !isGroup) return 'single_full';
      if (title.includes('[뮤직뱅크/musicbank]') && isGroup) return 'main';
    }

    if (program.key === 'musiccore') {
      if (title.includes('1위직캠fancam') && isGroup) return 'live';
      if (title.includes('fancam')) return isGroup ? 'full' : 'single_full';
      if (title.includes('close-upcam') && !isGroup) return 'single_face';
      if (title.includes('[#최애직캠') && !isGroup) return 'single_face';
      if (title.includes('[예능연구소직캠]')) return isGroup ? 'full' : 'single_full';
      if (title.includes('show!musiccore') && isGroup) return 'main';
    }

    if (program.key === 'inkigayo') {
      if (title.includes('fullcam)') || (title.includes('풀캠') && isGroup))
        if (title.includes('[superultra8k]')) return 'full_hd';
        else return 'full';
      if (title.includes('[항공캠') && isGroup) return 'tower';
      if (title.includes('[단독샷캠') && isGroup) return '1take';
      if (title.includes('[지미집캠') && isGroup) return '1take';
      if (title.includes('[사이드캠') && isGroup) return 'side';
      if (title.includes('[리허설캠') && isGroup) return 'rehearsal';
      if (title.includes('[앵콜캠') && isGroup) return 'live';
      if (title.includes('[안방1열') && !isGroup) return 'single_full';
      if (title.includes('[페이스캠') && !isGroup) return 'single_face';
      if (title.includes('@인기가요inkigayo') && isGroup) return 'main';
    }

    if (program.key === 'theshow') {
      if (title.includes('fancam') && isGroup) return 'full';
      if (title.includes('focus[theshow') && !isGroup) return 'single_face';
      if (title.includes('theshowchoice!') && isGroup) return 'live';
      if (title.includes('[theshow') && isGroup) return 'main';
    }

    if (program.key === 'showchampion') {
      if (title.includes('[쇼챔직캠')) return isGroup ? 'full' : 'single_full';
      if (title.includes('[쇼챔원픽캠') && !isGroup) return 'single_face';
      if (title.includes('showchampion') && !title.includes('mc석인터뷰') && isGroup) return 'main';
    }

    return null;
  }
}
