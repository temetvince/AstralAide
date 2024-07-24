import Corporation from "./corporation/Corporation";
import Type from "./Type";
import Updatable from "./assorted/interfaces/Updatable";
import { getCookie, RouteManager as RM } from "../assorted/Utils";
import axios from "axios";
import Race from "./Race";

interface BloodlineProps {
   id: number;
   race?: Race;
   corporation?: Corporation;
   shipType?: Type;
   name?: string;
   description?: string;
   charisma?: number;
   intelligence?: number;
   memory?: number;
   perception?: number;
   willpower?: number;
}

class Bloodline implements Updatable {
   public id: number;
   public race?: Race;
   public corporation?: Corporation;
   public shipType?: Type;
   public name?: string;
   public description?: string;
   public charisma?: number;
   public intelligence?: number;
   public memory?: number;
   public perception?: number;
   public willpower?: number;

   public constructor(props: BloodlineProps) {
      this.id = props.id;
      this.race = props.race;
      this.corporation = props.corporation;
      this.shipType = props.shipType;
      this.name = props.name;
      this.description = props.description;
      this.charisma = props.charisma;
      this.intelligence = props.intelligence;
      this.memory = props.memory;
      this.perception = props.perception;
      this.willpower = props.willpower;
   }

   public async refresh(): Promise<void> {
      let result;

      try {
         result = await axios.get(RM.getRouteUrl("bloodline"), {
            params: {
               state: getCookie("uuid"),
            },
         });
      } catch {
         return;
      }

      if (result && result.status === 200) {
         result.data.forEach(async (bloodline: any) => {
            if (bloodline.bloodline_id === this.id) {
               this.id = bloodline.bloodline_id;
               this.race = bloodline.race_id
                  ? new Race({ id: bloodline.race_id })
                  : undefined;
               this.corporation = bloodline.corporation_id
                  ? new Corporation({
                       id: bloodline.corporation_id,
                    })
                  : undefined;
               this.shipType = bloodline.ship_type_id
                  ? new Type({ id: bloodline.ship_type_id })
                  : undefined;
               this.name = bloodline.name;
               this.description = bloodline.description;
               this.charisma = bloodline.charisma;
               this.intelligence = bloodline.intelligence;
               this.memory = bloodline.memory;
               this.perception = bloodline.perception;
               this.willpower = bloodline.willpower;
            }
         });
      }
   }
}

export default Bloodline;
