import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import Searcher from './searcher.js';
import Youtube from './youtube.js';

const dataFolder = 'data';

class TwinkleManager {
  public static createTwinkle(artist: Artist, title: string): void {
    const id = crypto.randomBytes(4).toString('hex');

    const twinkle: Twinkle = {
      id,
      artist,
      music: title,
      sessions: [],
    };

    TwinkleManager.save(twinkle);
  }

  public static async getTwinkleById(id: string): Promise<Twinkle | null> {
    const list = await fs.readdir(dataFolder);
    const filteredList = list.filter(item => item.endsWith('twk'));

    const twinkleFile = filteredList.find(item => item.includes(id));
    if (!twinkleFile) return null;

    const file = await fs.readFile(path.join(dataFolder, twinkleFile));
    const json = file.toString();
    const data = JSON.parse(json);

    return data;
  }

  public static async getTwinkleList(): Promise<Twinkle[]> {
    const list = await fs.readdir(dataFolder);
    const filteredList = list.filter(item => item.endsWith('twk'));

    const result: Twinkle[] = [];
    for (const item of filteredList) {
      const file = await fs.readFile(path.join(dataFolder, item));
      const json = file.toString();
      const data = JSON.parse(json);
      result.push(data);
    }

    return result;
  }

  public static async addSession(
    twinkle: Twinkle,
    date: string,
    program: Program
  ): Promise<Twinkle> {
    const id = crypto.randomBytes(4).toString('hex');
    twinkle.sessions.push({ id, date, program, segments: [] });

    await TwinkleManager.save(twinkle);
    return twinkle;
  }

  public static async removeSession(twinkle: Twinkle, id: string): Promise<Twinkle> {
    twinkle.sessions = twinkle.sessions.filter(item => item.id !== id);

    await TwinkleManager.save(twinkle);
    return twinkle;
  }

  public static async loadSessions(twinkle: Twinkle, setTwinkle: any): Promise<Twinkle> {
    const youtube = new Youtube();
    const searcher = new Searcher(youtube, twinkle, setTwinkle);
    await youtube.init();
    await searcher.search();
    await TwinkleManager.save(twinkle);

    return twinkle;
  }

  private static async save(twinkle: Twinkle): Promise<void> {
    const fileName = `${twinkle.artist.id}.${twinkle.id}.twk`;
    await fs.writeFile(path.join(dataFolder, fileName), JSON.stringify(twinkle, null, 2));
  }

  public static async dumpUntaggedVideo(title: string): Promise<void> {
    const fileName = `untagged.twkdump`;
    await fs.appendFile(path.join(dataFolder, fileName), title);
  }
}

export default TwinkleManager;
