# Todo Serverless

A fully-serverless todo list made using Serverless Framework.

## Installation

```bash
cd /path/to/todo-serverless
npm install

npm run dynamodb:install
```

## Running locally

Uncomment `serverless-static` plugin:

```yml
plugins:
  ...
  # comment-out the next line while deploying due to
  # https://github.com/iliasbhal/serverless-static/issues/3
  - serverless-static
```

```bash
npm start
```

## Configuration

Create `.env` file on project's root directory:

```
DOMAIN=todo.andyautida.com
CERTIFICATE=arn:aws:acm:us-east-1:xxxxxxxxxxxx:certificate/xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx
```

## Deployment

```sh
# full deploy to 'prod' environment:
npm run deploy -- --stage prod

# deploy using 'personal' AWS profile:
AWS_PROFILE=personal npm run deploy -- --stage prod

# deploy frontend only:
npm run client:deploy -- --stage prod

# deploy backend only:
npm run deploy -- --stage prod --no-client-deploy
```

## Notes

If `src/client/lib/index.js` is modified, it should be rebundled by browserify to reflect the changes:

```sh
npm install -g browserify
browserify src/client/lib/index.js -o src/client/lib/bundle.js --debug
```
