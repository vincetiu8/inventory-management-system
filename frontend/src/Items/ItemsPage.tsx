import React from "react";
import SortedTable from "../Assets/SortedTable";
import { IHeadCell } from "../Assets/headCell";
import { IItem } from "../Assets/models";
import ItemHistoryModal from "./ItemHistoryModal";

const headCells: IHeadCell<IItem>[] = [
  {
    id: "itemId",
    label: "Item ID",
    numeric: true,
  },
  {
    id: "name",
    label: "Name",
    numeric: false,
  },
  {
    id: "description",
    label: "Description",
    numeric: false,
  },
  {
    id: "quantity",
    label: "Quantity",
    numeric: true,
  },
];

interface ItemsPageProps {
  token: string;
}

/**
 * Displays a table of items
 * @param token - the JWT token
 */
function ItemsPage({ token }: ItemsPageProps) {
  return (
    <SortedTable
      token={token}
      schemaId="items"
      headCells={headCells}
      defaultOrderBy="itemId"
      defaultOrder="asc"
      name="Item"
      OnClickModal={ItemHistoryModal}
    />
  );
}

export default ItemsPage;
