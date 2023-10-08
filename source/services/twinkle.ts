import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

class TwinkleManager {
  public static createTwinkle(artist: Artist, title: string): void {
    const id = crypto.randomBytes(4).toString('hex');
    const fileName = `${artist.id}.${id}.json`;

    const twinkle: Twinkle = {
      id,
      artist,
      music: title,
    };

    fs.writeFile(path.join('data', fileName), JSON.stringify(twinkle));
  }
}

export default TwinkleManager;
