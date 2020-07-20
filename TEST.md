# xo-demo

XO transaction processor demo for sawtooth

## local development

Install node modules:

```
yarn install
yarn run develop
```

Deploy sawtooth using docker-compose:

```
cd sawtooth-core/docker/compose
git checkout btp-releases/1.0.5
docker-compose -f sawtooth-default-go.yaml up
```

Activate the xo tp:

```
docker exec -it sawtooth-validator-default sawset proposal create \
  --url http://rest-api:8008 \
  --key /root/.sawtooth/keys/my_key.priv \
  sawtooth.validator.transaction_families='[{"family": "intkey", "version": "1.0"},
      {"family":"sawtooth_settings", "version":"1.0"}, {"family":"xo", "version":"1.0"}]'
docker exec -it sawtooth-validator-default sawtooth settings list --url http://rest-api:8008
```

The application will communicate to the rest api via `localhost:8008`

You can view it in the browser at `http://localhost:8080`
