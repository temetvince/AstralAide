interface ItemProps {
   itemId: number;
   typeId: number;
}
class Item {
   public itemId: number;
   public typeId: number;

   public constructor(props: ItemProps) {
      this.itemId = props.itemId;
      this.typeId = props.typeId;
   }
}

export default Item;
