'use strict';

//mongoose file must be loaded before all other files in order to provide
// models to other modules
var express = require('express'),
  router = express.Router(),
  Twit = require('twit')

  const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

  var T = new Twit({
    consumer_key:         process.env.CONSUMER_KEY,
    consumer_secret:      process.env.CONSUMER_SECRET,
    access_token:         process.env.ACCESS_TOKEN,
    access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  });
  let tweets_seen = 0;
  var stream = T.stream('statuses/filter', { track: ['reported missing', 'missing report', 'has been missing', 'missing in', 'police report missing' ], language: 'en' })
    stream.on('tweet', async function (tweet) {
        if (tweets_seen === 100) {
            await sleep(4000000);
            tweets_seen = 0;
        }else{
            T.post('statuses/retweet/:id', { id: tweet.id_str }, function (err, data, response) {
               if (!data.errors) {
                   tweets_seen += 1;
               }
              });
           
        }
        
    });

var app = express();


app.use('/api/v1', router);
const port = process.env.PORT || 4000
app.listen(port);
console.log("App started on port ", port)
module.exports = app;