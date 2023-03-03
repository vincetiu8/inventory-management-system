/**
 * Represents a single employee
 */
interface IEmployee {
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

/**
 * Represents a single item
 */
interface IItem {
  itemId: number;
  name: string;
  description: string;
  quantity: number;
}

/**
 * Represents a single transaction
 */
interface ITransaction {
  txId: number;
  date: string;
  quantity: number;
  transactionType: string;
  externalEntity: string;
  reporter: string;
  itemId: number;
}

export type { IEmployee, IItem, ITransaction };
