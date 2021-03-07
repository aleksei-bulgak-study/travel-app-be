import express from 'express';

import configs from './config';
import errorHandler from './middleware/errorHandlingMiddleware';

import { SwaggerRouter, UserRouter, CountryRouter, SightRouter } from './routes';
import { UserService, CountryService, SightsService } from './service';

configs.config();
configs.dbConfig();
const countryService = new CountryService();
const sightsService = new SightsService();
const userService = new UserService();

const app = express();
app.use(express.json());
app.use(SwaggerRouter);

app.use('/countries', CountryRouter(countryService), SightRouter(countryService, sightsService));
app.use('/users', UserRouter(userService));

app.use(errorHandler);

app.listen(process.env['PORT'] || 3000, () => {
  console.log(`starting application at port ${process.env['PORT']}`)
});

process.on('uncaughtException', (err) => {
  console.log('Uncaught exception was thrown due to', err);
  process.exit(1);
});

process.on('unhandledRejection', () => {
  console.log('Unhandler rejection error was thrown due to');
});