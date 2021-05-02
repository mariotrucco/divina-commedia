import { Client, RequestParams } from '@elastic/elasticsearch';
import { SearchResult, Verso } from './verso';
import { CanticaTitle } from '../canticas/cantica';
import { CantoTitle } from '../cantos/canto';

export class VersosService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async get(
    cantica: CanticaTitle,
    canto: CantoTitle,
    number: number
  ): Promise<Verso> {
    const params: RequestParams.Search = {
      index: 'verso',
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
    // TODO check that there is exactly 1 result
    return response.body.hits.hits[0]._source;
  }

  async search(text: string): Promise<SearchResult> {
    const params: RequestParams.Search = {
      index: 'verso',
      body: {
        query: {
          match: {
            text
          }
        },
        sort: {
          terzina: { order: 'desc' }
        },
        from: 0,
        size: 14233
      }
    };
    const response = await this.client.search(params);
    return {
      versos: response.body.hits.hits.map(
        (hit: { _source: unknown }) => hit._source
      )
    };
  }
}
