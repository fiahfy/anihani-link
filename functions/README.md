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

## GAE

### Deploy
```
gcloud app deploy
# cron jobs
gcloud app deploy cron.yaml
```

### Show Logs
```
gcloud app logs tail -s default
```


## CLI

### Update Groups
```
node cli.js group
```

### Update Members
```
node cli.js member
```

### Update Schedules
```
node cli.js schedule -g <group-id> [--force]
```