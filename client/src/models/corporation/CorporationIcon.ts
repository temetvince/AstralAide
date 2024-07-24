import axios from "axios";
import Updatable from "../assorted/interfaces/Updatable";
import { getCookie, RouteManager as RM } from "../../assorted/Utils";
import Corporation from "./Corporation";

interface CorporationIconProps {
   corporation: Corporation;
   small?: string;
   medium?: string;
   large?: string;
   extraLarge?: string;
}

class CorporationIcon implements Updatable {
   public corporation: Corporation;
   public small: string | undefined;
   public medium: string | undefined;
   public large: string | undefined;

   public constructor(props: CorporationIconProps) {
      this.corporation = props.corporation;
      this.small = props.small;
      this.medium = props.medium;
      this.large = props.large;
   }

   public async refresh(): Promise<void> {
      let result;

      try {
         result = await axios.get(RM.getRouteUrl("corporation/icon"), {
            params: {
               state: getCookie("uuid"),
               id: this.corporation.id,
            },
         });
      } catch {
         return;
      }

      if (result && result.status === 200) {
         this.small = result.data.px64x64;
         this.medium = result.data.px128x128;
         this.large = result.data.px256x256;
      }
   }
}

export default CorporationIcon;
