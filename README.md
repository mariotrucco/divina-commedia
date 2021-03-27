# Divina Commedia

Halfway along our life's path - I put [Dante's Comedy](https://en.wikipedia.org/wiki/Divine_Comedy) on Elasticsearch.

## Requirements

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/get-npm)

I recommend [Volta](https://volta.sh/), the hassle-free JavaScript tool manager which also manages package managers. The moment you `cd` into the project's root directory it will use the correct versions of node and npm. 

## Dependencies

- [Elasticsearch](https://www.elastic.co/elasticsearch/). Configuration options:    
    - `node`: the Url for [the client](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/typescript_examples.html#typescript_examples).
    - `numberOfReplicas`: for indices [settings](https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-update-settings.html).


You can specify the configuration options in  a `JSON` file within the [config](config) directory. The name of the file must match the value of the `NODE_ENV` variable, which you must provide as environment variable. 

### With Docker

If you are running [Docker](https://www.docker.com/), you can use dependencies out of the box with

```bash
docker-compose up
```

The corresponding configuration options are provided for `NODE_ENV=dev` in [config/dev.json](config/dev.json). 

## Migrations

To start working on the Comedy with this project, you need to have its text on Elasticsearch. For that, use

```bash
NODE_ENV=dev npm run migrate
```

I intentionally added prints and sleeps so that you can observe the [Terzine](https://en.wikipedia.org/wiki/Terza_rima) while they are being stored, this causes the migrations to take some minutes - it can be almost instantaneous if those sleeps are removed.

![Sample: text of CANTO XXVI (Ulixes') printed by the migrate command while indexing on Elasticsearch](readme_migrate.png)

## Linting

Powered by [ESLint](https://eslint.org/).

### Run the linter

```bash
npm run lint
```

### Let the linter fix your errors and ovverride the files

```bash
npm run lint:fix
```

## Formatting

Powered by [Prettier](https://prettier.io/)

### Format the code on demand

```bash
npm run format
```

### Check formatting without overriding the files

```bash
npm run format:check
```

### Format the code automatically on save

```bash
npm run format:watch
```

## Start the app

Currently, this app only searches for  `"le Stelle."` in the Comedy's text, using our copy of [Elasticsearch's Italian Analyzer](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-lang-analyzer.html#italian-analyzer).

The first results:

```javascript
{
  cantica: 'Purgatorio',
  canto: 'Canto XXXIII',
  terzina: 49,
  number: 145,
  text: 'puro e disposto a salire a le stelle.'
}
{
  cantica: 'Paradiso',
  canto: 'Canto XXIV',
  terzina: 49,
  number: 147,
  text: 'e come stella in cielo in me scintilla».'
}
{
  cantica: 'Paradiso',
  canto: 'Canto XXXIII',
  terzina: 49,
  number: 145,
  text: 'l’amor che move il sole e l’altre stelle.'
}
{
  cantica: 'Inferno',
  canto: 'Canto XXXIV',
  terzina: 47,
  number: 139,
  text: 'E quindi uscimmo a riveder le stelle.'
}
```


### With optimized build

```bash
NODE_ENV=dev npm run start
```

### With hot realod (for development)

```bash
NODE_ENV=dev npm run start:watch
```

## Further Steps

* Expose a REST API with OpenAPI
* Improve the analyzer and/or use NLP approaches to be better with [Dante's language](https://en.wikipedia.org/wiki/Dolce_Stil_Novo)
* Allow saving notes 
* Build a UI
* ...
