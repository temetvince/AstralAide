import axios, { AxiosResponse } from 'axios';
import { type Request, type Response } from 'express';
import Globals from './globals.mjs';

/**
 * Represents the response object returned by the token endpoint.
 */
interface TokenResponse {
   access_token: string;
   refresh_token: string;
   expires_in: number;
   token_type: string;
}

/**
 * Authenticates the user using the provided refresh token.
 * @param refreshToken The refresh token used for authentication.
 * @returns A promise that resolves to the token response or null if authentication fails.
 */
const authenticate = async (
   refreshToken: string,
): Promise<TokenResponse | null> => {
   const url = 'https://login.eveonline.com/v2/oauth/token/';
   const data = `grant_type=refresh_token&refresh_token=${refreshToken}`;
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
         return response.data as TokenResponse;
      }
   } catch (error) {
      console.error(error);
   }

   return null;
};

/**
 * Tries to make a call to an external API using the provided callback function.
 * If the call fails with a 401 Unauthorized error, it attempts to authenticate the user and retry the call.
 * @param req The Express request object.
 * @param res The Express response object.
 * @param refreshToken The refresh token used for authentication.
 * @param callback The callback function that makes the API call.
 * @returns A promise that resolves to void.
 */
const tryCall = async (
   req: Request,
   res: Response,
   refreshToken: string,
   callback: () => Promise<AxiosResponse>,
): Promise<void> => {
   try {
      const response = await callback();
      if (response && response.status === 200) {
         res.status(200).send(response.data);
         return;
      }
   } catch (error) {
      try {
         const auth = await authenticate(refreshToken);
         if (auth) {
            Globals.getLogins().set(
               req.query.state as string,
               auth.access_token,
            );
            Globals.getTokens().set(
               req.query.state as string,
               auth.refresh_token,
            );

            try {
               const response2 = await callback();
               if (response2 && response2.status === 200) {
                  res.status(200).send(response2.data);
                  return;
               } else {
                  res.status(503).send();
                  return;
               }
            } catch {
               res.status(503).send();
               return;
            }
         }
      } catch {
         res.status(401).send('Unauthorized');
         return;
      }
   }
};

/**
 * Handles the request by making an API call to the specified URL.
 * @param req The Express request object.
 * @param res The Express response object.
 * @param url The URL to make the API call to.
 * @returns A promise that resolves to void.
 */
const runner = async (req: Request, res: Response, url: string) => {
   const uuid = req.query.state;

   if (!uuid) {
      res.status(400).send('Bad Request');
      return;
   }

   const accessToken = Globals.getLogins().get(uuid as string);
   const refreshToken = Globals.getTokens().get(uuid as string);

   if (!accessToken || !refreshToken) {
      res.status(401).send('Unauthorized');
      return;
   }

   await tryCall(req, res, refreshToken!, async () => {
      return await axios.get(url, {
         headers: {
            Authorization: `Bearer ${accessToken}`,
         },
      });
   });
};

export default runner;
