# anihani-link

> WIP

## Build Setup

``` bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
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
```

### Import functions config
```
firebase functions:config:set $(jq -r 'to_entries[] | [.key, (.value | tojson)] | join("=")' < .runtimeconfig.json)
```

### Export functions config
```
firebase functions:config:get > .runtimeconfig.json
```
