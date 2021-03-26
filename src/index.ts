import { Client, RequestParams } from '@elastic/elasticsearch';

async function search(): Promise<void> {
  const client = new Client({ node: 'http://localhost:9200' });
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
