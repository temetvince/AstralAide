import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import authentication from './endpoints/authentication.mjs';
import assorted from './endpoints/assorted.mjs';
import character from './endpoints/character.mjs';
import corporation from './endpoints/corporation.mjs';

/**
 * Sets up the endpoints for the Express app.
 * @param app - The Express app.
 */
const setupEndpoints = (app: express.Express) => {
   authentication(app);
   assorted(app);
   character(app);
   corporation(app);
};

/**
 * The main function that starts the server.
 */
const main = async () => {
   const app = express();
   const PORT = process.env.PORT || 4430;

   const __filename = fileURLToPath(import.meta.url);
   const __dirname = path.dirname(__filename);

   app.use(express.static(path.join(__dirname, '../../client/dist')));

   app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
      console.log('Press Ctrl+C to quit.');
   }).on('error', (err) => {
      console.error(err);
   });

   setupEndpoints(app);
};

/**
 * Immediately invoked async function that calls the main function.
 */
(async () => {
   await main();
})();
