interface PositionProps {
   x: number;
   y: number;
   z: number;
}

class Position {
   public x: number;
   public y: number;
   public z: number;

   public constructor(props: PositionProps) {
      this.x = props.x;
      this.y = props.y;
      this.z = props.z;
   }
}

export default Position;
