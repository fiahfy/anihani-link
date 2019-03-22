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

### Fetch Wiki Pages
```
node cli.js fetch wiki -g <group_id> [--force]
```

### Fetch Tweets
```
node cli.js fetch tweets -g <group_id> [--force]
```
