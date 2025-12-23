import { getCardById } from "../core/cards.ts";

export interface ItemSelectionProps {
  itemGroups: number[][];

  onConfirm?: (items: number[]) => void;
}

export function ItemSelectionComponent(
  { itemGroups, onConfirm }: ItemSelectionProps,
) {
  const itemGroupsInfo = itemGroups.map((
    itemsId,
  ) => (itemsId.map((id) => getCardById(id))));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const selectedItems = retrieveSelectedItemsFromForm(e.currentTarget);
        onConfirm && onConfirm(selectedItems);
      }}
    >
      {itemGroupsInfo.map((group, i) => (
        <div key={i}>
          <select name={"item_" + i} required>
            {group.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>
      ))}
      <button type="submit">Confirm</button>
    </form>
  );
}

function retrieveSelectedItemsFromForm(form: HTMLFormElement): number[] {
  const data = new FormData(form);
  const itemsIds: number[] = [];
  data.forEach((value, key) => {
    if (key.startsWith("item_")) {
      itemsIds.push(Number.parseInt(value.toString()));
    }
  });
  return itemsIds;
}
