import { Client, RequestParams } from '@elastic/elasticsearch';
import config from 'config';

async function search(): Promise<void> {
  const client = new Client({ node: config.get<string>('elasticsearch.node') });
  const params: RequestParams.Search = {
    index: 'verso',
    body: {
      query: {
        match: {
          text: 'le Stelle.'
        }
      },
      sort: {
        terzina: { order: 'desc' }
      }
    }
  };
  const result = await client.search(params);
  result.body.hits.hits.map((hit: { _source: unknown }) =>
    console.log(hit._source)
  );
}

search();
