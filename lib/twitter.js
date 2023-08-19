const { TwitterApi } = require('twitter-api-v2');

module.exports = {
  /**
   * @param {string} text
   * @param {string} usertoken
   *
   * @throws {Promise<import('twitter-api-v2').TweetV2PostTweetResult>}
   */
  async createTweet(text) {
    if (!process.env.APP_KEY || !process.env.APP_SECRET || !process.env.ACCESS_TOKEN || !process.env.ACCESS_SECRET) {
      throw Error('トークンは必須です。');
    }

    const { readWrite: client } = new TwitterApi({
      appKey: process.env.APP_KEY,
      appSecret: process.env.APP_SECRET,
      accessToken: process.env.ACCESS_TOKEN,
      accessSecret: process.env.ACCESS_SECRET,
    });

    return await client.v2.tweet({ text });
  },

  /**
   * @param {string} todayForDisplay ex) `2023年4月1日`
   * @param {string} nowForDisplay ex) `12時34分56秒`
   * @param {import('./interface/Event').Event[]} events
   * @returns {string}
   */
  generateTweet(todayForDisplay, nowForDisplay, events) {
    const lines = [`[${todayForDisplay} の東京ドームイベント情報]`];

    if (events.length === 0) {
      lines.push(...['イベントはありません。', '']);
    } else {
      /**
       * @type {import('./interface/Event').Event}
       */
      const event = events[0];
      lines.push(event.title);
      if (event.term) {
        lines.push(event.term);
      }
      if (event.opening_time || event.open_time) {
        lines.push(event.opening_time !== '' ? `開場: ${event.opening_time}` : event.open_time);
      }
      if (event.detail_url) {
        const url = /^https?:\/\//.test(event.detail_url)
          ? event.detail_url
          : `https://www.tokyo-dome.co.jp${event.detail_url}`;
        lines.push(url);
      }

      if (events.length > 1) {
        lines.push('', '※他1件のイベントあり');
      }

      lines.push('');
    }

    lines.push(`(${nowForDisplay}現在)`);

    const _lines = lines
      .map((v) => v.replace('&lt;br&gt;', '\n').replace(/<br(?: \/)?>/g, '\n'))
      .join('\n')
      .split('\n');
    const __lines = [..._lines];
    const linesWithoutDuplicated = __lines.filter((v, idx) => v !== '\n' && !__lines.includes(v, idx + 1));

    return linesWithoutDuplicated.join('\n');
  },
};
