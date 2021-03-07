import express, { Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';

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
app.use(cors())
app.use(express.json());
app.use(fileUpload());
app.use(SwaggerRouter);

app.use('/countries', CountryRouter(countryService), SightRouter(countryService, sightsService));
app.use('/users', UserRouter(userService));
app.use('*', (req: Request, res: Response): void => {
  res.status(404).json({ message: `Page not found for url ${req.originalUrl}` });
});

app.use(errorHandler);

const port = process.env['PORT'] || 3000;
app.listen(port, () => {
  console.log(`starting application at port ${port}`);
});

process.on('uncaughtException', (err) => {
  console.log('Uncaught exception was thrown due to', err);
  process.exit(1);
});

process.on('unhandledRejection', () => {
  console.log('Unhandler rejection error was thrown due to');
});