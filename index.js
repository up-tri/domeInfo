require('dotenv').config();

const functions = require('@google-cloud/functions-framework');
const dayjs = require('dayjs');

const { getTheDayEvents } = require('./lib/tokyoDome');
const { generateTweet, createTweet } = require('./lib/twitter');
const TARGET_EVENT_CATEGORY = 'TokyoDome';

/**
 * Responds to an HTTP request using data from the request body parsed according
 * to the "content-type" header.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
functions.http('helloDomeInfo', async (req, res) => {
  const now = dayjs();
  const usertoken = process.env.USER_TOKEN;
  const events = await getTheDayEvents(now.format('YYYYMMDD'), TARGET_EVENT_CATEGORY);
  const eventText = generateTweet(now.format('YYYY年M月D日'), now.format('HH:mm:ss'), events);

  const result = await createTweet(eventText, usertoken);
  console.log(JSON.stringify(result));

  res.status(200).send('OK');
});
