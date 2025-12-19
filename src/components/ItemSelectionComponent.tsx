import { getItemById } from "../services/AppService.ts";

export interface ItemSelectionProps {
  itemGroups: string[][];

  onConfirm?: (items: string[]) => void;
}

export function ItemSelectionComponent(
  { itemGroups, onConfirm }: ItemSelectionProps,
) {
  const itemGroupsInfo = itemGroups.map((
    itemsId,
  ) => (itemsId.map((id) => getItemById(id))));

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

function retrieveSelectedItemsFromForm(form: HTMLFormElement): string[] {
  const data = new FormData(form);
  const itemsIds: string[] = [];
  data.forEach((value, key) => {
    if (key.startsWith("item_")) itemsIds.push(value.toString());
  });
  return itemsIds;
}
