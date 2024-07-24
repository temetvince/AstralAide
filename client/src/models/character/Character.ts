import axios from "axios";
import Updatable from "../assorted/interfaces/Updatable";
import Corporation from "../corporation/Corporation";
import Alliance from "../Alliance";
import Faction from "../Faction";
import Race from "../Race";
import Bloodline from "../Bloodline";
import { getCookie, RouteManager as RM } from "../../assorted/Utils";

interface CharacterProps {
   id: number;
   alliance?: Alliance;
   bloodline?: Bloodline;
   corporation?: Corporation;
   faction?: Faction;
   race?: Race;
   birthday?: Date;
   description?: string;
   gender?: string;
   name?: string;
   securityStatus?: number;
   title?: string;
}

class Character implements Updatable {
   public id: number;
   public alliance?: Alliance;
   public bloodline?: Bloodline;
   public corporation?: Corporation;
   public faction?: Faction;
   public race?: Race;
   public birthday?: Date;
   public description?: string;
   public gender?: string;
   public name?: string;
   public securityStatus?: number;
   public title?: string;

   public constructor(props: CharacterProps) {
      this.id = props.id;
      this.alliance = props.alliance;
      this.bloodline = props.bloodline;
      this.corporation = props.corporation;
      this.faction = props.faction;
      this.race = props.race;
      this.birthday = props.birthday ? new Date(props.birthday) : undefined;
      this.description = props.description;
      this.gender = props.gender;
      this.name = props.name;
      this.securityStatus = props.securityStatus;
      this.title = props.title;
   }

   public async refresh(): Promise<void> {
      let result;

      try {
         result = await axios.get(RM.getRouteUrl("character"), {
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

         this.bloodline = result.data.bloodline_id
            ? new Bloodline({
                 id: result.data.bloodline_id,
              })
            : undefined;

         this.corporation = result.data.corporation_id
            ? new Corporation({
                 id: result.data.corporation_id,
              })
            : undefined;

         this.faction = result.data.faction_id
            ? new Faction({
                 id: result.data.faction_id,
              })
            : undefined;

         this.race = result.data.race_id
            ? new Race({
                 id: result.data.race_id,
              })
            : undefined;

         this.birthday = result.data.birthday
            ? new Date(result.data.birthday)
            : undefined;
         this.description = result.data.description;
         this.gender = result.data.gender;
         this.name = result.data.name;
         this.securityStatus = result.data.security_status;
         this.title = result.data.title;
      }
   }
}

export default Character;
