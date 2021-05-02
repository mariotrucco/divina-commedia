import { Client } from '@elastic/elasticsearch';
import { mocked } from 'ts-jest/utils';
import { LinesService } from './linesService';
jest.mock('@elastic/elasticsearch');

describe('linesService', () => {
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

  describe('get', () => {
    it('should filter by Cantica, Canto and Line', async () => {
      const target = new LinesService(client);
      await target.get('Inferno', 'Canto V', 138);
      expect(client.search).toHaveBeenNthCalledWith(1, {
        index: 'line',
        body: {
          query: {
            bool: {
              filter: [
                { term: { cantica: 'Inferno' } },
                { term: { canto: 'Canto V' } },
                { term: { number: 138 } }
              ]
            }
          }
        }
      });
    });
  });

  describe('search', () => {
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
          size: 10000
        }
      });
    });
  });
});
