import axios from "axios";
import { getCookie, RouteManager as RM } from "../assorted/Utils";
import Corporation from "./corporation/Corporation";
import Updatable from "./assorted/interfaces/Updatable";

interface FactionProps {
   id: number;

   corporation?: Corporation;
   militiaCorporation?: Corporation;
   systemId?: number;

   description?: string;
   isUnique?: boolean;
   name?: string;
   sizeFactor?: number;
   stationCount?: number;
   stationSystemCount?: number;
}

class Faction implements Updatable {
   public id: number;
   public corporation?: Corporation;
   public militiaCorporation?: Corporation;
   public systemId?: number;
   public description?: string;
   public isUnique?: boolean;
   public name?: string;
   public sizeFactor?: number;
   public stationCount?: number;
   public stationSystemCount?: number;

   public constructor(props: FactionProps) {
      this.id = props.id;
      this.corporation = props.corporation;
      this.militiaCorporation = props.militiaCorporation;
      this.systemId = props.systemId;
      this.description = props.description;
      this.isUnique = props.isUnique;
      this.name = props.name;
      this.sizeFactor = props.sizeFactor;
      this.stationCount = props.stationCount;
      this.stationSystemCount = props.stationSystemCount;
   }

   public async refresh(): Promise<void> {
      let result;

      try {
         result = await axios.get(RM.getRouteUrl("factions"), {
            params: {
               state: getCookie("uuid"),
            },
         });
      } catch {
         return;
      }

      if (result && result.status === 200) {
         result.data.forEach(async (faction: any) => {
            if (faction.faction_id === this.id) {
               this.corporation = faction.corporation_id
                  ? new Corporation({
                       id: faction.corporation_id,
                    })
                  : undefined;

               this.militiaCorporation = faction.militia_corporation_id
                  ? new Corporation({
                       id: faction.militia_corporation_id,
                    })
                  : undefined;

               this.systemId = faction.system_id;
               this.description = faction.description;
               this.isUnique = faction.is_unique;
               this.name = faction.name;
               this.sizeFactor = faction.size_factor;
               this.stationCount = faction.station_count;
               this.stationSystemCount = faction.station_system_count;
            }
         });
      }
   }
}

export default Faction;
