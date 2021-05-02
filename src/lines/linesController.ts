import { Client } from '@elastic/elasticsearch';
import { Controller, Get, Path, Route } from 'tsoa';
import { LinesService } from './linesService';
import { CanticaTitle } from '../canticas/cantica';
import { CantoTitle } from '../cantos/canto';
import { Line } from './lines';
import config from 'config';

// TODO IoC https://tsoa-community.github.io/docs/di.html#ioc-module
const client = new Client({ node: config.get<string>('elasticsearch.node') });

@Route('canticas/{cantica}/cantos/{canto}/lines')
export class LinesController extends Controller {
  @Get('{line}')
  public async getLine(
    @Path() cantica: CanticaTitle,
    @Path() canto: CantoTitle,
    @Path() line: number
  ): Promise<Line> {
    return new LinesService(client).get(cantica, canto, line);
  }
}
