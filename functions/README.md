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
