import { Client, RequestParams } from '@elastic/elasticsearch';
import { SearchResult, Line } from './lines';
import { CanticaTitle } from '../canticas/cantica';
import { CantoTitle } from '../cantos/canto';

export class LinesService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async get(
    cantica: CanticaTitle,
    canto: CantoTitle,
    number: number
  ): Promise<Line | null> {
    const params: RequestParams.Search = {
      index: 'line',
      body: {
        query: {
          bool: {
            filter: [
              { term: { cantica } },
              { term: { canto } },
              { term: { number } }
            ]
          }
        }
      }
    };
    const response = await this.client.search(params);
    const hits = response.body.hits.hits;
    // TODO check that there is exactly 1 result
    return hits.length > 0 ? hits[0]._source : null;
  }

  async search(text: string): Promise<SearchResult> {
    const params: RequestParams.Search = {
      index: 'line',
      body: {
        query: {
          match: {
            text
          }
        },
        sort: {
          tercet: { order: 'desc' }
        },
        from: 0,
        size: 10000
      }
    };
    const response = await this.client.search(params);
    return {
      lines: response.body.hits.hits.map(
        (hit: { _source: unknown }) => hit._source
      )
    };
  }
}
