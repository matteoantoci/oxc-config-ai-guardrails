// Fixture: oxc/no-async-endpoint-handlers only fires on express-shaped routers.
import express from 'express';

const app = express();

app.get('/things', async (req, res) => {
  res.send('ok');
});
