import React from "react";
import SortedTable, { IHeadCell } from "../Assets/SortedTable";

interface IEmployee {
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

const headCells: IHeadCell<IEmployee>[] = [
  {
    id: "email",
    label: "Email",
    numeric: false,
  },
  {
    id: "firstName",
    label: "First Name",
    numeric: false,
  },
  {
    id: "lastName",
    label: "Last Name",
    numeric: false,
  },
  {
    id: "isAdmin",
    label: "Is Admin",
    numeric: false,
  },
];

interface EmployeesPageProps {
  token: string;
}

/**
 * Displays a table of employees
 * @param token - the JWT token
 */
function EmployeesPage({ token }: EmployeesPageProps) {
  return (
    <SortedTable
      token={token}
      schemaId="employees"
      headCells={headCells}
      defaultOrderBy="email"
    />
  );
}

export default EmployeesPage;
