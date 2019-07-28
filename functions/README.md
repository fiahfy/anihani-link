# functions


## Development
```
cd functions
yarn
```
* Export config
    ```
    firebase functions:config:get > .runtimeconfig.json
    ```
* Download service account key and save as `key.json`

### Emulate locally (HTTP function only)
```
yarn serve
```

### Emulate locally
```
yarn shell
```


## CLI

### Update Groups
```
node cli.js update groups
```

### Update Members
```
node cli.js update members
```

### Fetch Tweets
```
node cli.js fetch tweets -g <group_id> [--force]
```

### Fetch Event details
```
node cli.js fetch event-details
```
