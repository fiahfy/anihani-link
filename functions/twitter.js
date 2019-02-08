const Twitter = require('twitter')
const fs = require('fs')

require('dotenv').config()

const Group = {
    animare: 'animare',
    honeyStrap: 'honey_strap'
}

const UserId = {
    [Group.animare]: '',
    [Group.honeyStrap]: 1007247110167674900, // @HNST_official
}


const admin = require('firebase-admin')
admin.initializeApp()

;(async () => {
  try {
      const querySnapshot = await admin.firestore().collection('anihani-schedule-tweets')
          .where('user_id', '==', UserId[Group.honeyStrap])
          .orderBy("created_at")
          .limit(1);
      console.log(querySnapshot)

          return

    const client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    })
    const results = await client.get('statuses/user_timeline', { screen_name: 'hnst_official' })
    console.log(results.length)
    fs.writeFileSync('./timeline.json', JSON.stringify(results));
  } catch (e) {
    console.error(e)
  }
})()

const Group = {
  animare: {
    "name": "Animare",
    "name_ja": "あにまーれ"
  },
  honeyStrap: {
    "name": "Honey Strap",
    "name_ja": "ハニーストラップ"
  },
}

const Member = {
  haneru: {
    "name": "Haneru Inaba",
    "name_ja": "因幡はねる",
    "group": Group.animare,
    "twitter": {

    }
  },
  hinako: {
    "name": "Hinako Umori",
    "name_ja": "宇森ひなこ",
    "group": Group.animare,
  },
  patra: {
    "name": "Patra Suo",
    "name_ja": "周防パトラ",
    "group": Group.honeyStrap,
  },
}

const ss = {
  "schedules": {
    "xxx": {
      "host": Member.haneru,
      "title": "",
      "description": "",
      "started_at": "",
      "ended_at": "",
      "published_at": "",
      "created_at": "",
      "updated_at": ""
    }
  }
}
