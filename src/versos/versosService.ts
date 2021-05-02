import { Client, RequestParams } from '@elastic/elasticsearch';
import { SearchResult } from './verso';

export class VersosService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
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
        }
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
