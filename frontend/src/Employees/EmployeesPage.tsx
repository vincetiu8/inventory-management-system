import React from "react";
import { Container } from "@mui/joy";
import SortedTable from "../Assets/SortedTable";
import { IHeadCell } from "../Assets/headCell";
import UpsertModal from "../Assets/UpsertModal";

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
    <Container maxWidth={false}>
      <SortedTable
        token={token}
        schemaId="employees"
        headCells={headCells}
        defaultOrderBy="email"
        defaultOrder="asc"
        name="Employee"
        OnClickModal={UpsertModal}
      />
    </Container>
  );
}

export default EmployeesPage;
