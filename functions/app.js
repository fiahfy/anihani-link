/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

// [START gae_node_request_example]
const express = require('express')

const app = express()

const serviceAccount = require('./key.json')
process.env.FIREBASE_SERVICE_ACCOUNT = JSON.stringify(serviceAccount)

const config = require('./.runtimeconfig.json')
process.env.TWITTER_CONSUMER_KEY = config.twitter.consumer_key
process.env.TWITTER_CONSUMER_SECRET = config.twitter.consumer_secret
process.env.TWITTER_ACCESS_TOKEN_KEY = ''
process.env.TWITTER_ACCESS_TOKEN_SECRET = ''

const updateSchedules = require('./actions/update_schedules')

app.get('/fetchTweets', async (req, res) => {
  await updateSchedules({ groupId: 'ani-mare' })
  await updateSchedules({ groupId: 'honey-strap' })

  res
    .status(200)
    .send('OK')
    .end()
})

// Start the server
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
  console.log('Press Ctrl+C to quit.')
})
// [END gae_node_request_example]
