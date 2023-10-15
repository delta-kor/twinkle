import Program from './program.js';
import Tagger from './tagger.js';
import Youtube from './youtube.js';

export type SearcherUpdateHandler = (twinkle: Twinkle) => void;

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
        .filter(video => video.channel === program.channelId);
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
    }

    return videos;
  }

  private async searchSession(session: Session): Promise<void> {
    const members =
      this.twinkle.artist.type === 'group'
        ? this.twinkle.artist.members
        : [this.twinkle.artist.name];

    for (const member of members) {
      const videos = await this.searchSegment(session, member);
      session.segments.push({ type: 'member', member, videos });
      this.onUpdate(this.twinkle);
    }

    const fullVideos = await this.searchSegment(
      session,
      null,
      session.segments.map(item => item.videos).flat()
    );
    session.segments.push({ type: 'full', videos: fullVideos });
    this.onUpdate(this.twinkle);
  }

  public async search(): Promise<void> {
    for (const session of this.twinkle.sessions) {
      if (session.segments.length > 0) continue;
      await this.searchSession(session);
    }
  }
}
