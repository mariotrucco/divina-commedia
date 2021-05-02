import { app } from './app';

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(
    `Divina Commedia API listening at http://localhost:${port}. Docs at http://localhost:${port}/docs`
  )
);
