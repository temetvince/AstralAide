import { Express } from 'express';
import runner from '../comms.mjs';

const corporation = (app: Express) => {
   app.get('/corporation', async (req, res) => {
      await runner(
         req,
         res,
         `https://esi.evetech.net/latest/corporations/${req.query.id}/`,
      );
   });

   app.get('/corporation/icon', async (req, res) => {
      await runner(
         req,
         res,
         `https://esi.evetech.net/latest/corporations/${req.query.id}/icons/`,
      );
   });
};

export default corporation;
