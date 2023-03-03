import React, { useEffect } from "react";
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

interface UpsertModalProps<Data> {
  token: string;
  name: string;
  headCells: IHeadCell<Data>[];
  schemaId: string;
  open: boolean;
  onClose: () => void;
  primaryKey: keyof Data;
  existingItem: Data | null;
}

/**
 * Modal for inserting a new item or updating an existing one
 * @param token - the JWT token
 * @param name - the name of the item
 * @param headCells - the head cells of the table
 * @param schemaId - the schema ID
 * @param open - whether the modal is open
 * @param onClose - the function to call when the modal is closed
 * @param primaryKey - the primary key of the item
 * @param existingItem - the existing item to update, if any
 */
function UpsertModal<Data>({
  token,
  name,
  headCells,
  schemaId,
  open,
  onClose,
  primaryKey,
  existingItem,
}: UpsertModalProps<Data>) {
  const [newItem, setNewItem] = React.useState<Data>(
    existingItem ||
      ({
        isAdmin: false,
      } as Data)
  );
  const [error, setError] = React.useState<string | null>(null);

  const submitItem = async () => {
    try {
      if (existingItem) {
        const resp = await axios.put(
          `/api/${schemaId}/${existingItem[primaryKey]}`,
          newItem,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (resp.status === 202) {
          onClose();
        }
        return;
      }
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

  useEffect(() => {
    setNewItem(
      existingItem ||
        ({
          isAdmin: false,
        } as Data)
    );
  }, [existingItem]);

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
            <Typography level="h4">
              {existingItem ? "Update" : "Insert"} {name}
            </Typography>
          </Grid>
          {headCells
            .filter(
              (cell) =>
                (cell.id !== primaryKey || !cell.numeric) &&
                cell.id !== "date" && // hardcoded
                cell.id !== "reporter" && // hardcoded
                cell.id !== "isAdmin" // we add this back in the modal, because this is a special boolean case
            )
            .map((headCell) => (
              <Grid key={headCell.id.toString()}>
                <FormLabel>{headCell.label}</FormLabel>
                <Input
                  placeholder={headCell.label}
                  value={newItem[headCell.id] ? `${newItem[headCell.id]}` : ""}
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
              {existingItem ? "Update" : "Create"} {name}
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

export default UpsertModal;
