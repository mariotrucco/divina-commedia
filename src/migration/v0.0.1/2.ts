import { Client, RequestParams } from '@elastic/elasticsearch';
import commedia from './data/divina_commedia.json';
import config from 'config';

const client = new Client({ node: config.get<string>('elasticsearch.node') });

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function putData(): Promise<void> {
  console.log('Commedia');
  console.log();
  await delay(2000);
  // eslint-disable-next-line no-loops/no-loops
  for (const cantica of commedia.children) {
    const name = cantica.name;
    console.log(name);
    console.log();
    await delay(2000);
    // eslint-disable-next-line no-loops/no-loops
    for (const canto of cantica.children) {
      const name = canto.name;
      console.log(name);
      console.log();
      await delay(1000);
      // eslint-disable-next-line no-loops/no-loops
      for (const terzina of canto.children) {
        // eslint-disable-next-line no-loops/no-loops
        for (const verso of terzina.children) {
          console.log(verso.text);
          const doc: RequestParams.Index = {
            index: 'verso',
            body: {
              cantica: cantica.name,
              canto: canto.name,
              terzina: terzina.number,
              number: verso.number,
              text: verso.text
            }
          };
          await client.index(doc);
          // await delay(800);
        }
        console.log();
      }
    }
    await delay(10000);
  }
}
