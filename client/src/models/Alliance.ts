import axios from "axios";
import Updatable from "./assorted/interfaces/Updatable";
import { getCookie, RouteManager as RM } from "../assorted/Utils";
import Corporation from "./corporation/Corporation";
import Character from "./character/Character";
import Faction from "./Faction";

interface AllianceProps {
   id: number;
   creatorCorporation?: Corporation;
   creator?: Character;
   executorCorporation?: Corporation;
   faction?: Faction;
   dateFounded?: Date;
   name?: string;
   ticker?: string;
}

class Alliance implements Updatable {
   public id: number;
   public creatorCorporation?: Corporation;
   public creator?: Character;
   public executorCorporation?: Corporation;
   public faction?: Faction;
   public dateFounded?: Date;
   public name?: string;
   public ticker?: string;

   public constructor(props: AllianceProps) {
      this.id = props.id;

      this.creatorCorporation = props.creatorCorporation;
      this.creator = props.creator;
      this.executorCorporation = props.executorCorporation;
      this.faction = props.faction;

      this.dateFounded = props.dateFounded
         ? new Date(props.dateFounded)
         : undefined;
      this.name = props.name;
      this.ticker = props.ticker;
   }

   public async refresh(): Promise<void> {
      let result;

      try {
         result = await axios.get(RM.getRouteUrl("alliance"), {
            params: {
               state: getCookie("uuid"),
               id: this.id,
            },
         });
      } catch {
         return;
      }

      if (result && result.status === 200) {
         this.creatorCorporation = result.data.creator_corporation_id
            ? new Corporation({
                 id: result.data.creator_corporation_id,
              })
            : undefined;

         this.creator = result.data.creator_id
            ? new Character({
                 id: result.data.creator_id,
              })
            : undefined;

         this.executorCorporation = result.data.executor_corporation_id
            ? new Corporation({
                 id: result.data.executor_corporation_id,
              })
            : undefined;

         this.faction = result.data.faction_id
            ? new Faction({
                 id: result.data.faction_id,
              })
            : undefined;

         this.dateFounded = result.data.date_founded
            ? new Date(result.data.date_founded)
            : undefined;
         this.name = result.data.name;
         this.ticker = result.data.ticker;
      }
   }
}

export default Alliance;
