import axios from "axios";
import { getCookie, RouteManager as RM } from "../assorted/Utils";
import Alliance from "./Alliance";
import Updatable from "./assorted/interfaces/Updatable";

interface RaceProps {
   id: number;
   alliance?: Alliance;
   name?: string;
   description?: string;
}

class Race implements Updatable {
   public id: number;
   public alliance?: Alliance;
   public name?: string;
   public description?: string;

   public constructor(props: RaceProps) {
      this.id = props.id;
      this.alliance = props.alliance;
      this.name = props.name;
      this.description = props.description;
   }

   public async refresh(): Promise<void> {
      let result;

      try {
         result = await axios.get(RM.getRouteUrl("race"), {
            params: {
               state: getCookie("uuid"),
            },
         });
      } catch {
         return;
      }

      if (result && result.status === 200) {
         result.data.forEach(async (race: any) => {
            if (race.race_id === this.id) {
               this.alliance = race.alliance_id
                  ? new Alliance({ id: race.alliance_id })
                  : undefined;

               this.name = race.name;
               this.description = race.description;
            }
         });
      }
   }
}

export default Race;
