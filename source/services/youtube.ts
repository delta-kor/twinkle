import axios from 'axios';

export interface YoutubeSearchResult {
  videos: YoutubeVideo[];
  continuation?: string;
}

export interface YoutubeSearchParams {
  query: string;
  continuation?: string;
}

export default class Youtube {
  private apiKey?: string;

  public async init(): Promise<Youtube> {
    const url = 'https://www.youtube.com/app_shell';
    const response = await axios.get<string>(url);
    const body = response.data;

    const apiKeyGroup = body.match(/"INNERTUBE_API_KEY":"(.+?)"/);
    if (!apiKeyGroup) throw new Error('Failed to fetch api key');

    const apiKey = apiKeyGroup[1];
    this.apiKey = apiKey;

    return this;
  }

  public async search(params: YoutubeSearchParams): Promise<YoutubeSearchResult> {
    const query = params.query;
    const requestContinuation = params.continuation;

    if (!this.apiKey) throw new Error('Youtube is not initialized yet');

    const url = `https://www.youtube.com/youtubei/v1/search?key=${this.apiKey}`;
    const payload: any = {
      context: {
        client: {
          clientName: 'WEB',
          clientVersion: '2.20230804.01.00',
        },
      },
      query,
    };

    if (requestContinuation) payload.continuation = requestContinuation;

    const response = await axios.post(url, JSON.stringify(payload), {
      headers: { 'Accept-Language': 'ko', 'Content-Type': 'application/json' },
    });

    const data: any = response.data;

    const sectionListRendererContents =
      data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents;

    const contents = sectionListRendererContents.find(
      (content: any) => Object.keys(content)[0] === 'itemSectionRenderer'
    ).itemSectionRenderer.contents;

    const continuation = sectionListRendererContents.find(
      (content: any) => Object.keys(content)[0] === 'continuationItemRenderer'
    ).continuationItemRenderer.continuationEndpoint.continuationCommand.token;

    const videos: YoutubeVideo[] = [];

    for (const content of contents) {
      if (!content.videoRenderer) continue;
      const renderer = content.videoRenderer;
      const id: string = renderer.videoId;
      const title: string = renderer.title.runs[0].text;
      const channel: string = renderer.ownerText.runs[0].navigationEndpoint.browseEndpoint.browseId;
      const overlays: any[] = renderer.thumbnailOverlays;
      if (overlays.find(item => item.thumbnailOverlayTimeStatusRenderer?.style === 'SHORTS'))
        continue;

      videos.push({ id, title, channel, tag: null });
    }

    return {
      videos,
      continuation,
    };
  }
}
