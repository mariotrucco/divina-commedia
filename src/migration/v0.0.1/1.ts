import { Client } from '@elastic/elasticsearch';
import config from 'config';

const client = new Client({ node: config.get<string>('elasticsearch.node') });

export async function setupIndex(): Promise<void> {
  const name = 'line';
  const version = 'v1';
  const index = `${name}-${version}`;
  await client.indices.create({
    index,
    body: {
      settings: {
        index: {
          number_of_replicas: config.get<string>(
            'elasticsearch.numberOfReplicas'
          )
        }
      }
    }
  });

  await client.indices.putAlias({
    index,
    name
  });

  await client.indices.close({ index });

  // Our Dante's Analyzer is a copy of the Italian Analyzer, which is designed for modern Italian
  // https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-lang-analyzer.html#italian-analyzer.
  // The goal is to later improve it and optimize it for Dante's language.
  await client.indices.putSettings({
    index,
    body: {
      settings: {
        analysis: {
          filter: {
            dante_elision: {
              type: 'elision',
              articles: [
                'c',
                'l',
                'all',
                'dall',
                'dell',
                'nell',
                'sull',
                'coll',
                'pell',
                'gl',
                'agl',
                'dagl',
                'degl',
                'negl',
                'sugl',
                'un',
                'm',
                't',
                's',
                'v',
                'd'
              ],
              articles_case: true
            },
            dante_stop: {
              type: 'stop',
              stopwords: '_italian_'
            },
            // Words to be excluded from stemming,
            // not sure if we'll need those. Let's only have "dante" for now
            dante_keywords: {
              type: 'keyword_marker',
              keywords: ['dante']
            },
            dante_stemmer: {
              type: 'stemmer',
              // The 'light_italian' stemmer is recommended by elasticsearch. We might also try 'italian'.
              // https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-stemmer-tokenfilter.html#analysis-stemmer-tokenfilter-configure-parms
              language: 'light_italian'
            }
          },
          analyzer: {
            dante: {
              tokenizer: 'standard',
              filter: [
                'dante_elision',
                'lowercase',
                'dante_stop',
                'dante_keywords',
                'dante_stemmer'
              ]
            }
          }
        }
      }
    }
  });

  await client.indices.open({ index });

  await client.indices.putMapping({
    index,
    body: {
      properties: {
        cantica: { type: 'keyword' },
        canto: { type: 'keyword' },
        tercet: { type: 'integer' },
        number: { type: 'integer' },
        text: { type: 'text', analyzer: 'dante' }
      }
    }
  });
}
