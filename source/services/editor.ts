import express, { Application } from 'express';
import TwinkleManager from './twinkle.js';

class Editor {
  private readonly application: Application = express();

  constructor(private readonly twinkle: Twinkle) {
    this.load();
  }

  private load(): void {
    this.application.use(express.static('public', { maxAge: 0 }));
    this.application.use(express.json());
    this.application.use('/data', express.static('data'));
    this.application.post('/save', (req, res) => {
      TwinkleManager.saveBeats(this.twinkle, req.body);
      res.json({ ok: true });
    });
  }

  public open(): void {
    this.application.listen(3000);
  }
}

export default Editor;
