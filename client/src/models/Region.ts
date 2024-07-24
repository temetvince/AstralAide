import axios from "axios";
import Updatable from "./assorted/interfaces/Updatable";
import { getCookie, RouteManager as RM } from "../assorted/Utils";
import Constellation from "./Constellation";

interface RegionProps {
   id: number;
   constellations?: Constellation[];
   description?: string;
   name?: string;
}

class Region implements Updatable {
   public id: number;
   public constellations?: Constellation[];
   public description?: string;
   public name?: string;

   constructor(props: RegionProps) {
      this.id = props.id;
      this.constellations = props.constellations;
      this.description = props.description;
      this.name = props.name;
   }

   public async refresh(): Promise<void> {
      let result;

      try {
         result = await axios.get(RM.getRouteUrl("region"), {
            params: {
               state: getCookie("uuid"),
               id: this.id,
            },
         });
      } catch {
         return;
      }

      if (result && result.status === 200) {
         this.constellations = result.data.constellations?.map(
            (constellation: { constellation_id: any }) => {
               if (constellation.constellation_id) {
                  return new Constellation({
                     id: constellation.constellation_id,
                  });
               }
            },
         );

         this.description = result.data.description;
         this.name = result.data.name;
      }
   }
}

export default Region;
