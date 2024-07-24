import axios from "axios";
import Updatable from "../assorted/interfaces/Updatable";
import { getCookie, RouteManager as RM } from "../../assorted/Utils";
import Character from "../character/Character";
import Faction from "../Faction";
import Alliance from "../Alliance";
import Station from "../Station";

interface CorporationProps {
   id: number;

   alliance?: Alliance;
   ceo?: Character;
   creator?: Character;
   faction?: Faction;
   homeStation?: Station;

   memberCount?: number;
   dateFounded?: Date;
   name?: string;
   description?: string;
   shares?: number;
   taxRate?: number;
   ticker?: string;
   url?: string;
   warEligable?: boolean;
}

class Corporation implements Updatable {
   public id: number;
   public alliance?: Alliance;
   public ceo?: Character;
   public creator?: Character;
   public faction?: Faction;
   public homeStation?: Station;
   public memberCount?: number;
   public dateFounded?: Date;
   public name?: string;
   public description?: string;
   public shares?: number;
   public taxRate?: number;
   public ticker?: string;
   public url?: string;
   public warEligable?: boolean;

   public constructor(props: CorporationProps) {
      this.id = props.id;

      this.alliance = props.alliance;
      this.ceo = props.ceo;
      this.creator = props.creator;
      this.faction = props.faction;
      this.homeStation = props.homeStation;

      this.memberCount = props.memberCount;
      this.dateFounded = props.dateFounded
         ? new Date(props.dateFounded)
         : undefined;
      this.name = props.name;
      this.description = props.description;
      this.shares = props.shares;
      this.taxRate = props.taxRate;
      this.ticker = props.ticker;
      this.url = props.url;
      this.warEligable = props.warEligable;
   }

   public async refresh(): Promise<void> {
      let result;

      try {
         result = await axios.get(RM.getRouteUrl("corporation"), {
            params: {
               state: getCookie("uuid"),
               id: this.id,
            },
         });
      } catch {
         return;
      }

      if (result && result.status === 200) {
         this.alliance = result.data.alliance_id
            ? new Alliance({
                 id: result.data.alliance_id,
              })
            : undefined;

         this.ceo = result.data.ceo_id
            ? new Character({
                 id: result.data.ceo_id,
              })
            : undefined;

         this.creator = result.data.creator_id
            ? new Character({
                 id: result.data.creator_id,
              })
            : undefined;

         this.faction = result.data.faction_id
            ? new Faction({
                 id: result.data.faction_id,
              })
            : undefined;

         this.homeStation = result.data.home_station_id
            ? new Station({
                 id: result.data.home_station_id,
              })
            : undefined;

         this.dateFounded = result.data.date_founded
            ? new Date(result.data.date_founded)
            : undefined;

         this.memberCount = result.data.member_count;
         this.name = result.data.name;
         this.description = result.data.description;
         this.shares = result.data.shares;
         this.taxRate = result.data.tax_rate;
         this.ticker = result.data.ticker;
         this.url = result.data.url;
         this.warEligable = result.data.war_eligable;
      }
   }
}

export default Corporation;
