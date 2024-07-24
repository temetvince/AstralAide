import { Express } from 'express';
import runner from '../comms.mjs';

const assorted = (app: Express) => {
   app.get('/region', async (req, res) => {
      await runner(
         req,
         res,
         `https://esi.evetech.net/latest/universe/regions/${req.query.id}/`,
      );
   });

   app.get('/station', async (req, res) => {
      await runner(
         req,
         res,
         `https://esi.evetech.net/latest/universe/stations/${req.query.id}/`,
      );
   });

   app.get('/type', async (req, res) => {
      await runner(
         req,
         res,
         `https://esi.evetech.net/latest/universe/types/${req.query.id}/`,
      );
   });
};

export default assorted;
