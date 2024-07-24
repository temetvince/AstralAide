import axios from "axios";
import Updatable from "./assorted/interfaces/Updatable";
import { getCookie, RouteManager as RM } from "../assorted/Utils";

interface TypeProps {
   id: number;
   capacity?: number;
   description?: string;
   graphicId?: number;
   groupId?: number;
   iconId?: number;
   marketGroupId?: number;
   mass?: number;
   name?: string;
   packagedVolume?: number;
   portionSize?: number;
   published?: boolean;
   radius?: number;
   volume?: number;
}

class Type implements Updatable {
   public id: number;
   public capacity?: number;
   public description?: string;
   public graphicId?: number;
   public groupId?: number;
   public iconId?: number;
   public marketGroupId?: number;
   public mass?: number;
   public name?: string;
   public packagedVolume?: number;
   public portionSize?: number;
   public published?: boolean;
   public radius?: number;
   public volume?: number;

   constructor(props: TypeProps) {
      this.id = props.id;
      this.capacity = props.capacity;
      this.description = props.description;
      this.graphicId = props.graphicId;
      this.groupId = props.groupId;
      this.iconId = props.iconId;
      this.marketGroupId = props.marketGroupId;
      this.mass = props.mass;
      this.name = props.name;
      this.packagedVolume = props.packagedVolume;
      this.portionSize = props.portionSize;
      this.published = props.published;
      this.radius = props.radius;
      this.volume = props.volume;
   }

   public async refresh(): Promise<void> {
      let result;

      try {
         result = await axios.get(RM.getRouteUrl("type"), {
            params: {
               state: getCookie("uuid"),
               id: this.id,
            },
         });
      } catch {
         return;
      }

      if (result && result.status === 200) {
         this.capacity = result.data.capacity;
         this.description = result.data.description;
         this.graphicId = result.data.graphic_id;
         this.groupId = result.data.group_id;
         this.iconId = result.data.icon_id;
         this.marketGroupId = result.data.market_group_id;
         this.mass = result.data.mass;
      }
   }
}

export default Type;
