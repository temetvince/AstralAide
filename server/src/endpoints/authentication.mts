import { Express } from 'express';
import runner from '../comms.mjs';
import axios from 'axios';
import Globals from '../globals.mjs';

/**
 * Defines the authentication endpoints for the Express app.
 * @param app The Express app.
 */
const authentication = (app: Express) => {
   /**
    * GET /authenticate
    * Endpoint for initiating the authentication process.
    * @param req The Express request object.
    * @param res The Express response object.
    */
   app.get('/authenticate', async (req, res) => {
      await runner(req, res, 'https://login.eveonline.com/oauth/verify');
   });

   /**
    * GET /login
    * Endpoint for handling the login process.
    * @param req The Express request object.
    * @param res The Express response object.
    */
   app.get('/login', async (req, res) => {
      const url = 'https://login.eveonline.com/v2/oauth/token/';
      const data = `grant_type=authorization_code&code=${req.query.code}`;
      const headers = {
         'Content-Type': 'application/x-www-form-urlencoded',
         Authorization:
            'Basic ' +
            Buffer.from(
               `${Globals.getClientId()}:${Globals.getClientSecret()}`,
            ).toString('base64'),
         Host: 'login.eveonline.com',
      };

      try {
         const response = await axios.post(url, data, { headers });

         if (response && response.status === 200) {
            Globals.getLogins().set(
               req.query.state as string,
               response.data.access_token,
            );
            Globals.getTokens().set(
               req.query.state as string,
               response.data.refresh_token,
            );

            res.status(200).redirect(Globals.getRootURI());
            return null;
         }
      } catch (error) {
         res.status(401).send('Unauthorized');
      }

      return null;
   });
};

export default authentication;
