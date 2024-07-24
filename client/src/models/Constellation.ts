import axios from "axios";
import Updatable from "./assorted/interfaces/Updatable";
import { getCookie, RouteManager as RM } from "../assorted/Utils";
import Position from "./assorted/simple/Position";
import Region from "./Region";

interface ConstellationProps {
   id: number;
   region?: Region;
   systemsIds?: number[];
   position?: Position;
   name?: string;
}

class Constellation implements Updatable {
   public id: number;
   public region?: Region;
   public systemsIds?: number[];
   public position?: Position;
   public name?: string;

   constructor(props: ConstellationProps) {
      this.id = props.id;
      this.region = props.region;
      this.systemsIds = props.systemsIds;
      this.position = props.position;
      this.name = props.name;
   }

   public async refresh(): Promise<void> {
      let result;

      try {
         result = await axios.get(RM.getRouteUrl("constellation"), {
            params: {
               state: getCookie("uuid"),
               id: this.id,
            },
         });
      } catch {
         return;
      }

      if (result && result.status === 200) {
         this.region = result.data.region
            ? new Region(result.data.region)
            : undefined;
         this.systemsIds = result.data.systems.map((system: any) => system);
         this.position = result.data.position
            ? new Position(result.data.position)
            : undefined;
         this.name = result.data.name;
      }
   }
}

export default Constellation;
