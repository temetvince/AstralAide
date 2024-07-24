import axios from "axios";
import Updatable from "./assorted/interfaces/Updatable";
import { getCookie, RouteManager as RM } from "../assorted/Utils";

interface UserProps {
   characterId: number;
   characterName?: string;
   characterOwnerHash?: string;
}

class User implements Updatable {
   public characterId: number;
   public characterName: string | undefined;
   public characterOwnerHash: string | undefined;

   public constructor(character: UserProps) {
      this.characterId = character.characterId;
      this.characterName = character.characterName;
      this.characterOwnerHash = character.characterOwnerHash;
   }

   public async refresh(): Promise<void> {
      let result;

      try {
         result = await axios.get(RM.getRouteUrl("authenticate"), {
            params: {
               state: getCookie("uuid"),
            },
         });
      } catch {
         return;
      }

      if (result && result.status === 200) {
         this.characterName = result.data.CharacterName;
         this.characterOwnerHash = result.data.CharacterOwnerHash;
      }
   }
}

export default User;
