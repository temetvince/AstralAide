import axios from "axios";
import Updatable from "../assorted/interfaces/Updatable";
import Character from "./Character";
import { getCookie, RouteManager as RM } from "../../assorted/Utils";

interface CharacterPortraitProps {
   character: Character;
   small?: string;
   medium?: string;
   large?: string;
   extraLarge?: string;
}

class CharacterPotrait implements Updatable {
   public character: Character;
   public small: string | undefined;
   public medium: string | undefined;
   public large: string | undefined;
   public extraLarge: string | undefined;

   public constructor(props: CharacterPortraitProps) {
      this.character = props.character;
      this.small = props.small;
      this.medium = props.medium;
      this.large = props.large;
      this.extraLarge = props.extraLarge;
   }

   public async refresh(): Promise<void> {
      let result;

      try {
         result = await axios.get(RM.getRouteUrl("character/portrait"), {
            params: {
               state: getCookie("uuid"),
               id: this.character.id,
            },
         });
      } catch {
         return;
      }

      if (result && result.status === 200) {
         this.small = result.data.px64x64;
         this.medium = result.data.px128x128;
         this.large = result.data.px256x256;
         this.extraLarge = result.data.px512x512;
      }
   }
}

export default CharacterPotrait;
