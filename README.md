# anihani-link

> Unofficial schedule site for AniMare and HoneyStrap


## Build Setup
``` bash
# install dependencies
$ yarn

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate

# deploy
$ yarn deploy
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).


## Firebase CLI

### Deploy
```
# functions (all functions)
firebase deploy --only functions
# functions (specified function)
firebase deploy --only functions:function1

# firestore (rules and indexes)
firebase deploy --only firestore
# firestore (rules)
firebase deploy --only firestore:rules
# firestore (indexes)
firebase deploy --only firestore:indexes

# hosting
firebase deploy --only hosting
```

### Import functions config
```
firebase functions:config:set $(jq -r 'to_entries[] | [.key, (.value | tojson)] | join("=")' < .runtimeconfig.json)
```

### Export functions config
```
firebase functions:config:get > .runtimeconfig.json
```
