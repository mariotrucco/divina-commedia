import { Client } from '@elastic/elasticsearch';
import config from 'config';
import { VersosService } from './versos/versosService';

const client = new Client({ node: config.get<string>('elasticsearch.node') });
const versosService = new VersosService(client);
versosService.search('le Stelle').then((result) => {
  console.log(result.versos);
});
