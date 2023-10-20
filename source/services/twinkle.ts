import { spawn } from 'child_process';
import crypto from 'crypto';
import ffmpeg from 'fluent-ffmpeg';
import file, { promises as fs } from 'fs';
import PQueue from 'p-queue';
import path from 'path';
import readline from 'readline';
import shell from 'shelljs';
import ytdl from 'ytdl-core';
import Searcher from './searcher.js';
import Youtube from './youtube.js';

const dataFolder = 'data';
const audioFolder = path.join(dataFolder, 'audio');

class TwinkleManager {
  public static createTwinkle(artist: Artist, title: string): void {
    const id = crypto.randomBytes(4).toString('hex');

    const twinkle: Twinkle = {
      id,
      artist,
      music: title,
      sessions: [],
      guideId: null,
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

  public static async resetSessions(twinkle: Twinkle): Promise<Twinkle> {
    for (const session of twinkle.sessions) {
      session.segments = [];
    }
    await TwinkleManager.save(twinkle);

    return twinkle;
  }

  public static async loadAudios(twinkle: Twinkle, setTwinkle: any): Promise<void> {
    const queue = new PQueue.default({ concurrency: 20, interval: 500 });
    const promises: any[] = [];

    for (const session of twinkle.sessions) {
      for (const segment of session.segments) {
        for (const video of segment.videos) {
          const videoId = video.id;
          const task = async () => {
            await TwinkleManager.downloadAudio(videoId, state => {
              video.state = state;
              setTwinkle(twinkle);
            });
            await TwinkleManager.save(twinkle);
          };
          promises.push(queue.add(task));
        }
      }
    }

    await Promise.all(promises);
  }

  public static async plotAudios(twinkle: Twinkle, setTwinkle: any): Promise<void> {
    return new Promise<void>(resolve => {
      const shell = spawn('python', ['lib/plotter.py', '--id', twinkle.id]);

      const reader = readline.createInterface({ input: shell.stdout });
      reader.on('line', (data: string) => {
        if (data.startsWith('>')) {
          const videoId = data.slice(1);

          const video = twinkle.sessions
            .map(session => session.segments)
            .flat()
            .map(segment => segment.videos)
            .flat()
            .find(video => video.id === videoId);

          if (video) video.state = 'plotted';
          setTwinkle(twinkle);
          TwinkleManager.save(twinkle);
        }
      });

      shell.on('close', () => resolve());
    });
  }

  private static async save(twinkle: Twinkle): Promise<void> {
    const fileName = `${twinkle.artist.id}.${twinkle.id}.twk`;
    await fs.writeFile(path.join(dataFolder, fileName), JSON.stringify(twinkle, null, 2));
  }

  private static async downloadAudio(
    videoId: string,
    callback: (state: VideoState) => void
  ): Promise<boolean> {
    callback('loading');
    const success = await TwinkleManager.extractAudio(videoId);
    if (!success) return false;

    callback('waving');
    const fileName = `${videoId}.mp3`;
    await TwinkleManager.wavifyAudio(videoId);
    await fs.unlink(path.join(audioFolder, fileName));
    callback('loaded');

    return true;
  }

  private static async extractAudio(videoId: string): Promise<boolean> {
    const fileName = `${videoId}.mp3`;
    return new Promise<boolean>(async resolve => {
      ytdl(videoId, { quality: 'lowestaudio', filter: 'audioonly' })
        .on('error', () => resolve(false))
        .pipe(file.createWriteStream(path.join(audioFolder, fileName)))
        .on('close', () => resolve(true));
    });
  }

  private static async wavifyAudio(videoId: string): Promise<void> {
    const fileName = `${videoId}.mp3`;
    const waveName = `${videoId}.wav`;
    const fileFullPath = path.join(path.resolve(), audioFolder, fileName);
    const waveFullPath = path.join(path.resolve(), audioFolder, waveName);

    return new Promise<void>(resolve => {
      ffmpeg(fileFullPath)
        .audioCodec('pcm_u8')
        .audioBitrate(15000)
        .audioChannels(1)
        .inputOption('-y')
        .output(waveFullPath)
        .on('end', () => resolve())
        .run();
    });

    return new Promise<void>(resolve => {
      const sh = shell.exec(
        `${process.env['WAVER']} -y -i "${fileFullPath}" -acodec pcm_u8 -ar 15000 -ac 1 "${waveFullPath}"`,
        { async: true, silent: true, windowsHide: true }
      );

      sh.stdout?.on('data', console.error);

      sh.on('close', () => {
        resolve();
      });
    });
  }

  public static async dumpUntaggedVideo(title: string): Promise<void> {
    const fileName = `untagged.twkdump`;
    const list: string[] = [];

    try {
      const file = await fs.readFile(path.join(dataFolder, fileName));
      list.push(...file.toString().split('\n'));
    } catch (e) {}

    if (list.includes(title)) return;
    list.push(title);

    await fs.writeFile(path.join(dataFolder, fileName), list.join('\n'));
  }
}

export default TwinkleManager;
