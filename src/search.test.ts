import { mocked } from 'ts-jest/utils';
import { Client } from '@elastic/elasticsearch';
import { search } from './search';
jest.mock('@elastic/elasticsearch');

describe('search', () => {
  const client = mocked(new Client({ node: '' }));

  beforeEach(() => {
    client.search = jest.fn().mockImplementation((params) =>
      Promise.resolve({
        body: {
          hits: {
            hits: [{ _source: `Mock hit for ${params}` }]
          }
        }
      })
    );
  });

  it('should search for the input text on Elasticsearch', async () => {
    await search(client, 'le Stelle.');

    expect(client.search).toHaveBeenNthCalledWith(1, {
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
    });
  });
});
