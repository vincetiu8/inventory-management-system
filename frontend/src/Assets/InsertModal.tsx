import React from "react";
import {
  Button,
  Checkbox,
  FormLabel,
  Grid,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
} from "@mui/joy";
import axios from "axios";
import { IHeadCell } from "./headCell";
import { ServerError } from "./serverError";

interface InsertModalProps<Data> {
  token: string;
  name: string;
  headCells: IHeadCell<Data>[];
  schemaId: string;
  open: boolean;
  onClose: () => void;
}

/**
 * Modal for inserting a new item
 * @param token - the JWT token
 * @param name - the name of the item
 * @param headCells - the head cells of the table
 * @param schemaId - the schema ID
 * @param open - whether the modal is open
 * @param onClose - the function to call when the modal is closed
 */
function InsertModal<Data>({
  token,
  name,
  headCells,
  schemaId,
  open,
  onClose,
}: InsertModalProps<Data>) {
  const [newItem, setNewItem] = React.useState<Data>({
    isAdmin: false,
  } as Data);
  const [error, setError] = React.useState<string | null>(null);

  const submitItem = async () => {
    try {
      const resp = await axios.post(`/api/${schemaId}/create`, newItem, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (resp.status === 201) {
        onClose();
      }
    } catch (e) {
      const err = e as ServerError;
      setError(err.response.data.message);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <ModalDialog>
        <ModalClose />
        <Grid container spacing={2} direction="column">
          <Grid sx={{ display: "flex", justifyContent: "center" }}>
            <Typography level="h4">Insert {name}</Typography>
          </Grid>
          {headCells.map((headCell) => (
            <Grid key={headCell.id.toString()}>
              <FormLabel>{headCell.label}</FormLabel>
              <Input
                placeholder={headCell.label}
                onChange={(e) => {
                  setNewItem({
                    ...newItem,
                    [headCell.id]: e.target.value,
                  });
                }}
                type={headCell.numeric ? "number" : "text"}
              />
            </Grid>
          ))}
          {
            // Also ask to specify user password
            schemaId === "employees" && (
              <Grid>
                <FormLabel>Password</FormLabel>
                <Input
                  placeholder="Password"
                  type="password"
                  onChange={(e) => {
                    setNewItem({
                      ...newItem,
                      password: e.target.value,
                    });
                  }}
                />
              </Grid>
            )
          }
          {
            // Also ask to specify if the user is an admin
            schemaId === "employees" && (
              <Grid>
                <FormLabel>Is Admin</FormLabel>
                <Checkbox
                  onChange={(e) => {
                    setNewItem({
                      ...newItem,
                      isAdmin: e.target.checked,
                    });
                  }}
                />
              </Grid>
            )
          }
          <Grid sx={{ display: "flex", justifyContent: "center" }}>
            <Button variant="outlined" onClick={submitItem}>
              Create {name}
            </Button>
          </Grid>
          {
            // Display error message if there is one
            error && (
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Typography level="body2" sx={{ color: "red" }}>
                  {error}
                </Typography>
              </Grid>
            )
          }
        </Grid>
      </ModalDialog>
    </Modal>
  );
}

export default InsertModal;
