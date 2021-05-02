import { Client } from '@elastic/elasticsearch';
import { mocked } from 'ts-jest/utils';
import { LinesService } from './linesService';
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
    const target = new LinesService(client);
    await target.search('le Stelle.');

    expect(client.search).toHaveBeenNthCalledWith(1, {
      index: 'line',
      body: {
        query: {
          match: {
            text: 'le Stelle.'
          }
        },
        sort: {
          tercet: { order: 'desc' }
        },
        from: 0,
        size: 14233
      }
    });
  });
});
