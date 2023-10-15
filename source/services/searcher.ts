import Program from './program.js';
import Tagger from './tagger.js';
import TwinkleManager from './twinkle.js';
import Youtube from './youtube.js';

export type SearcherUpdateHandler = (twinkle: Twinkle) => void;

const TagOrder: VideoTag[] = [
  'main',
  'full_hd',
  'full',
  '1take',
  'tower',
  'side',
  'live',
  'rehearsal',
  'single_full',
  'single_face',
];

export default class Searcher {
  private readonly youtube: Youtube;
  private readonly twinkle: Twinkle;
  private readonly onUpdate: SearcherUpdateHandler;

  constructor(youtube: Youtube, twinkle: Twinkle, onUpdate: SearcherUpdateHandler) {
    this.youtube = youtube;
    this.twinkle = twinkle;
    this.onUpdate = onUpdate;
  }

  private async searchSegment(
    session: Session,
    member: string | null,
    exclude?: YoutubeVideo[]
  ): Promise<YoutubeVideo[]> {
    const program = Program(session.program);

    const searchQuery = member
      ? `${session.date} ${this.twinkle.music} ${member} ${program.searchName}`
      : `${session.date} ${this.twinkle.music} ${program.searchName}}`;
    const result = await this.youtube.search({ query: searchQuery });

    let videos = result.videos.filter(video =>
      video.title.toLowerCase().includes(this.twinkle.music.toLowerCase())
    );

    if (member)
      videos = videos
        .filter(item => item.title.includes(member!))
        .filter(video => video.channel === program.mainId || video.channel === program.channelId);
    if (exclude)
      videos = videos
        .filter(item => !exclude!.map(video => video.id).includes(item.id))
        .filter(video => video.channel === program.mainId || video.channel === program.channelId);

    if (program.key === 'showchampion') {
      videos = videos.filter(video => {
        const sanitizedTitle = video.title.replace(/ /g, '').replace(/\./g, '');
        return sanitizedTitle.includes(session.date.replace('.', ''));
      });
    } else {
      videos = videos.filter(video => {
        const sanitizedTitle = video.title.replace(/ /g, '').replace(/\./g, '');
        const sanitizedDate = [
          session.date,
          session.date
            .match(/..?/g)!
            .map(Number)
            .map(item => item.toString())
            .join(''),
        ];
        return sanitizedDate.some(date => sanitizedTitle.includes(date));
      });
    }

    for (const video of videos) {
      video.tag = Tagger.tagVideo(video, program, !member);
      if (video.tag === null) {
        await TwinkleManager.dumpUntaggedVideo(video.title);
      }
    }

    const taggedVideos = videos.filter(video => video.tag);
    taggedVideos.sort((a, b) => TagOrder.indexOf(a.tag!) - TagOrder.indexOf(b.tag!));

    return taggedVideos;
  }

  private async searchSession(session: Session): Promise<void> {
    const members =
      this.twinkle.artist.type === 'group'
        ? this.twinkle.artist.members
        : [this.twinkle.artist.name];

    const promises: any[] = [];

    for (const member of members) {
      const promise = this.searchSegment(session, member).then(videos => {
        session.segments
          .find(segment => segment.type === 'member' && segment.member === member)
          ?.videos.push(...videos);

        this.onUpdate(this.twinkle);
      });

      promises.push(promise);
    }

    await Promise.all(promises);

    const fullVideos = await this.searchSegment(
      session,
      null,
      session.segments.map(item => item.videos).flat()
    );
    session.segments.find(segment => segment.type === 'full')?.videos.push(...fullVideos);

    this.onUpdate(this.twinkle);
  }

  public async search(): Promise<void> {
    const members =
      this.twinkle.artist.type === 'group'
        ? this.twinkle.artist.members
        : [this.twinkle.artist.name];

    const promises: any[] = [];

    for (const session of this.twinkle.sessions) {
      if (session.segments.length > 0) continue;

      for (const member of members)
        session.segments.push({ type: 'member', member: member, videos: [] });
      session.segments.push({ type: 'full', videos: [] });

      promises.push(this.searchSession(session));
    }

    await Promise.all(promises);
  }
}
