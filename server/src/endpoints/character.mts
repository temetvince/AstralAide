import { Express } from 'express';
import runner from '../comms.mjs';

const character = (app: Express) => {
   app.get('/alliance', async (req, res) => {
      await runner(
         req,
         res,
         `https://esi.evetech.net/latest/alliances/${req.query.id}/`,
      );
   });

   app.get('/bloodline', async (req, res) => {
      await runner(
         req,
         res,
         `https://esi.evetech.net/latest/universe/bloodlines/`,
      );
   });

   app.get('/race', async (req, res) => {
      await runner(req, res, `https://esi.evetech.net/latest/universe/races/`);
   });

   app.get('/character', async (req, res) => {
      await runner(
         req,
         res,
         `https://esi.evetech.net/latest/characters/${req.query.id}/`,
      );
   });

   app.get('/character/portrait', async (req, res) => {
      await runner(
         req,
         res,
         `https://esi.evetech.net/latest/characters/${req.query.id}/portrait/`,
      );
   });
};

export default character;
