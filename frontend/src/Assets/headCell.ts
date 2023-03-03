/**
 * An interface for the head cell of a table. Also used by the insert modal to render relevant information
 * @param Data The type of the data to be displayed in the table
 */
export interface IHeadCell<Data> {
  id: keyof Data;
  label: string;
  numeric: boolean;
}
