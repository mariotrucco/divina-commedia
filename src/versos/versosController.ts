import { Client } from '@elastic/elasticsearch';
import { Controller, Get, Path, Route } from 'tsoa';
import { VersosService } from './versosService';
import { CanticaTitle } from '../canticas/cantica';
import { CantoTitle } from '../cantos/canto';
import { Verso } from './verso';
import config from 'config';

// TODO IoC https://tsoa-community.github.io/docs/di.html#ioc-module
const client = new Client({ node: config.get<string>('elasticsearch.node') });

@Route('canticas/{cantica}/cantos/{canto}/versos')
export class VersosController extends Controller {
  @Get('{verso}')
  public async getVerso(
    @Path() cantica: CanticaTitle,
    @Path() canto: CantoTitle,
    @Path() verso: number
  ): Promise<Verso> {
    return new VersosService(client).get(cantica, canto, verso);
  }
}
