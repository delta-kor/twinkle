import { ProgramData } from './program.js';

export default class Tagger {
  public static tagVideo(
    video: YoutubeVideo,
    program: ProgramData,
    isGroup: boolean
  ): VideoTag | null {
    const title = video.title;

    if (program.key === 'mcountdown') {
      if (title.includes('1위 앵콜 직캠') && isGroup) return 'live';
      if (title.startsWith('[MPD직캠')) return isGroup ? 'full' : 'single_full';
      if (title.startsWith('[입덕직캠') && !isGroup) return 'single_face';
    }

    if (program.key === 'musicbank') {
      if (title.startsWith('[K-Choreo') && isGroup) return 'full';
      if (title.startsWith('[사운드 360') && isGroup) return 'full';
      if (title.startsWith('[뮤뱅 원테이크') && isGroup) return '1take';
      if (title.startsWith('[K-Choreo Tower Cam') && isGroup) return 'tower';
      if (title.startsWith('[K-Fancam') && !isGroup) return 'single_full';
      if (title.startsWith('[얼빡직캠') && !isGroup) return 'single_face';
      if (title.includes('뮤직뱅크 1위 앵콜') && isGroup) return 'live';
      if (title.includes('풀캠ver') && isGroup) return 'full';
      if (title.includes('뮤직뱅크 직캠') && !isGroup) return 'single_full';
    }

    if (program.key === 'musiccore') {
      if (title.includes('1위 직캠 FanCam') && isGroup) return 'live';
      if (title.includes('FanCam')) return isGroup ? 'full' : 'single_full';
      if (title.includes('Close-up Cam') && !isGroup) return 'single_face';
      if (title.includes('[#최애직캠') && !isGroup) return 'single_face';
      if (title.includes('[예능연구소 직캠]')) return isGroup ? 'full' : 'single_full';
    }

    if (program.key === 'inkigayo') {
      if (title.includes('FullCam)') && isGroup) return 'full';
      if (title.includes('Full Cam)') && isGroup) return 'full';
      if (title.includes('풀캠') && isGroup) return 'full';
      if (title.includes('[항공캠') && isGroup) return 'tower';
      if (title.includes('[단독샷캠') && isGroup) return '1take';
      if (title.includes('[지미집캠') && isGroup) return '1take';
      if (title.includes('[사이드캠') && isGroup) return 'side';
      if (title.includes('[리허설캠') && isGroup) return 'rehearsal';
      if (title.includes('[앵콜캠') && isGroup) return 'live';
      if (title.includes('[안방1열') && !isGroup) return 'single_full';
      if (title.includes('[페이스캠') && !isGroup) return 'single_face';
    }

    if (program.key === 'theshow') {
      if (title.includes('Fancam') && isGroup) return 'full';
      if (title.includes('Focus [THE SHOW') && !isGroup) return 'single_face';
      if (title.includes('THE SHOW CHOICE!') && isGroup) return 'live';
    }

    if (program.key === 'showchampion') {
      if (title.includes('[쇼챔직캠')) return isGroup ? 'full' : 'single_full';
      if (title.includes('[쇼챔 원픽캠') && !isGroup) return 'single_face';
    }

    return null;
  }
}
