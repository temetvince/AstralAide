import axios from "axios";
import Updatable from "./assorted/interfaces/Updatable";
import { getCookie, RouteManager as RM } from "../assorted/Utils";
import Corporation from "./corporation/Corporation";
import Position from "./assorted/simple/Position";
import Race from "./Race";
import Type from "./Type";
import { Services } from "./assorted/enums/Services";

interface StationProps {
   id: number;

   race?: Race;
   systemId?: number;
   type?: Type;

   maxDockableShipVolume?: number;
   name?: string;
   officeRentalCost?: number;
   owner?: Corporation;
   position?: Position;
   reprocessingEfficiency?: number;
   reprocessingStationsTake?: number;
   services?: Services[];
}

class Station implements Updatable {
   public id: number;
   public race?: Race;
   public systemId?: number;
   public type?: Type;
   public owner?: Corporation;
   public position?: Position;
   public services?: Services[];
   public maxDockableShipVolume?: number;
   public name?: string;
   public officeRentalCost?: number;
   public reprocessingEfficiency?: number;
   public reprocessingStationsTake?: number;

   constructor(props: StationProps) {
      this.id = props.id;

      this.race = props.race;
      this.systemId = props.systemId;
      this.type = props.type;
      this.owner = props.owner;
      this.position = props.position;

      this.services = props.services
         ? props.services.map(
              (service: Services) =>
                 Services[service as unknown as keyof typeof Services],
           )
         : undefined;

      this.maxDockableShipVolume = props.maxDockableShipVolume;
      this.name = props.name;
      this.officeRentalCost = props.officeRentalCost;
      this.reprocessingEfficiency = props.reprocessingEfficiency;
      this.reprocessingStationsTake = props.reprocessingStationsTake;
   }

   public async refresh(): Promise<void> {
      let result;

      try {
         result = await axios.get(RM.getRouteUrl("station"), {
            params: {
               state: getCookie("uuid"),
               id: this.id,
            },
         });
      } catch {
         return;
      }

      if (result && result.status === 200) {
         this.race = result.data.race_id
            ? new Race({
                 id: result.data.race_id,
              })
            : undefined;

         (this.systemId = result.data.system_id),
            (this.type = new Type({
               id: result.data.type_id,
            }));
         this.owner = new Corporation({
            id: result.data.owner_id,
         });
         this.position = new Position({
            x: result.data.position.x,
            y: result.data.position.y,
            z: result.data.position.z,
         });

         this.services = result.data.services;

         this.maxDockableShipVolume = result.data.max_dockable_ship_volume;
         this.name = result.data.name;
         this.officeRentalCost = result.data.office_rental_cost;
         this.reprocessingEfficiency = result.data.reprocessing_efficiency;
         this.reprocessingStationsTake = result.data.reprocessing_stations_take;
      }
   }
}

export default Station;
