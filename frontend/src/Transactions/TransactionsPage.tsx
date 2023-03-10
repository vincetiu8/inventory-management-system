import React from "react";
import SortedTable from "../Assets/SortedTable";
import { IHeadCell } from "../Assets/headCell";
import { ITransaction } from "../Assets/models";

const headCells: IHeadCell<ITransaction>[] = [
  {
    id: "txId",
    label: "Transaction ID",
    numeric: true,
  },
  {
    id: "date",
    label: "Date",
    numeric: false,
  },
  {
    id: "quantity",
    label: "Quantity",
    numeric: true,
  },
  {
    id: "transactionType",
    label: "Transaction Type",
    numeric: false,
  },
  {
    id: "externalEntity",
    label: "External Entity",
    numeric: false,
  },
  {
    id: "reporter",
    label: "Reporter",
    numeric: false,
  },
  {
    id: "itemId",
    label: "Item ID",
    numeric: true,
  },
];

interface TransactionsPageProps {
  token: string;
}

/**
 * Displays a table of transactions
 * @param token
 */
function TransactionsPage({ token }: TransactionsPageProps) {
  return (
    <SortedTable
      token={token}
      schemaId="txs"
      headCells={headCells}
      defaultOrderBy="txId"
      defaultOrder="desc"
      name="Transaction"
      OnClickModal={null}
    />
  );
}

export default TransactionsPage;
