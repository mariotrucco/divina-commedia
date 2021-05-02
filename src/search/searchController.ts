import { Client } from '@elastic/elasticsearch';
import config from 'config';
import { SearchResult } from 'src/lines/lines';
import { LinesService } from '../lines/linesService';
import { Body, Controller, Post, Route } from 'tsoa';

// TODO IoC https://tsoa-community.github.io/docs/di.html#ioc-module
const client = new Client({ node: config.get<string>('elasticsearch.node') });

@Route('search')
export class SearchController extends Controller {
  @Post()
  public async searchLines(
    @Body() searchInput: { text: string }
  ): Promise<SearchResult> {
    return new LinesService(client).search(searchInput.text);
  }
}
