import { Client, RequestParams } from '@elastic/elasticsearch';

export async function search(client: Client, text: string): Promise<void> {
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
  const response = await client.search(params);
  response.body.hits.hits.map((hit: { _source: unknown }) =>
    console.log(hit._source)
  );
}
