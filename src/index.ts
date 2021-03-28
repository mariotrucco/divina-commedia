import { Client } from '@elastic/elasticsearch';
import config from 'config';
import { search } from './search';

const client = new Client({ node: config.get<string>('elasticsearch.node') });
search(client, 'le Stelle.');
