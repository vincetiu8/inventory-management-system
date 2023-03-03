import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Input,
  Link,
  Menu,
  MenuItem,
  Option,
  Select,
  Sheet,
  Table,
  Typography,
} from "@mui/joy";
import {
  ArrowDownward,
  Check,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import axios from "axios";
import UpsertModal from "./UpsertModal";
import { IHeadCell } from "./headCell";

interface TableProps<Data> {
  token: string;
  name: string;
  schemaId: string;
  headCells: IHeadCell<Data>[];
  defaultOrderBy: keyof Data;
  defaultOrder: Order;
  OnClickModal: any | null;
}

type Order = "asc" | "desc";

/**
 * A table that can be sorted by clicking on the column headers and filtered through a search bar.
 * Also has a button to add items.
 * @param token - the JWT token
 * @param name - the name of the item to be displayed in the table
 * @param schemaId - the schema ID to be used as the URL extension when making requests
 * @param headCells - the column headers
 * @param defaultOrderBy - the column to sort by default
 * @param defaultOrder - the order to sort by default
 * @param OnClickModal - the modal to be displayed when an item is clicked
 */
function SortedTable<Data>({
  token,
  name,
  schemaId,
  headCells,
  defaultOrderBy,
  defaultOrder,
  OnClickModal,
}: TableProps<Data>) {
  // The items to be displayed in the table
  const [items, setItems] = useState<Data[] | null>(null);

  // Filtering and sorting parameters
  const [order, setOrder] = useState<Order>(defaultOrder);
  const [orderBy, setOrderBy] = useState<keyof Data>(defaultOrderBy);
  const [searchKey, setSearchKey] = useState<string>("");
  const [searchAttributes, setSearchAttributes] = useState<string[]>([]);

  // Used to indicate the parent element of the menu component
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);

  // Pagination parameters
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);

  // Modal parameters
  const [insertModalOpen, setInsertModalOpen] = useState<boolean>(false);
  const [clickedItem, setClickedItem] = useState<Data | null>(null);

  // Fetches the items from the database
  const fetchItems = async () => {
    const response = await axios.post(
      `/api/${schemaId}/search`,
      {
        order,
        orderBy: orderBy.toString(),
        searchKey,
        attributes:
          searchAttributes.length !== 0
            ? searchAttributes
            : headCells.map((c) => c.id.toString()),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.data;
    setItems(data);
    setPage(0);
  };

  // Updates the attribute filters
  function updateFilter(newFilter: string) {
    if (searchAttributes.indexOf(newFilter) !== -1) {
      setSearchAttributes(searchAttributes.filter((f) => f !== newFilter));
    } else {
      setSearchAttributes([...searchAttributes, newFilter]);
    }
  }

  useEffect(() => {
    if (items == null) {
      fetchItems();
    }
  });

  useEffect(() => {
    const fetchItemsWrapper = async () => {
      await fetchItems();
    };
    fetchItemsWrapper();
  }, [order, orderBy, searchKey, searchAttributes]);

  return (
    <Container maxWidth={false}>
      <Grid
        container
        alignItems="center"
        direction="column"
        sx={{
          marginTop: 2,
        }}
      >
        <Grid>
          <Grid container spacing={2}>
            <Grid>
              <Input
                placeholder="Search Term"
                onChange={(e) => {
                  setSearchKey(e.target.value);
                }}
              />
            </Grid>
            <Grid>
              <Button
                variant="outlined"
                onClick={(e) => setAnchorElement(e.currentTarget)}
              >
                Filtering By:{" "}
                {searchAttributes.length === headCells.length ||
                searchAttributes.length === 0
                  ? "All"
                  : searchAttributes
                      .map(
                        (attr) =>
                          headCells.filter((cell) => cell.id === attr)[0].label
                      )
                      .join(", ")}
              </Button>
              <Menu
                anchorEl={anchorElement}
                open={Boolean(anchorElement)}
                onClose={() => setAnchorElement(null)}
              >
                {headCells.map((headCell) => (
                  <MenuItem
                    key={headCell.id.toString()}
                    onClick={() => {
                      updateFilter(headCell.id.toString());
                      setAnchorElement(null);
                    }}
                  >
                    {searchAttributes.indexOf(headCell.id.toString()) !==
                      -1 && <Check sx={{ marginRight: 1 }} />}
                    {headCell.label}
                  </MenuItem>
                ))}
              </Menu>
            </Grid>
            <Grid>
              <Button
                variant="outlined"
                onClick={() => {
                  setInsertModalOpen(true);
                }}
              >
                Add {name}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid>
          <Sheet
            variant="outlined"
            sx={{
              marginLeft: 10,
              marginRight: 10,
              marginTop: 2,
              borderRadius: "sm",
            }}
          >
            <Table>
              <thead>
                <tr>
                  {headCells.map((headCell) => (
                    <th key={headCell.id.toString()}>
                      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                      <Link
                        underline="none"
                        color="neutral"
                        textColor={
                          orderBy === headCell.id ? "primary" : undefined
                        }
                        component="button"
                        fontWeight="lg"
                        endDecorator={
                          <ArrowDownward
                            sx={{ opacity: orderBy === headCell.id ? 1 : 0 }}
                          />
                        }
                        sx={{
                          "& svg": {
                            transition: "0.2s",
                            transform:
                              orderBy === headCell.id && order === "desc"
                                ? "rotate(0deg)"
                                : "rotate(180deg)",
                          },
                          "&:hover": { "& svg": { opacity: 1 } },
                        }}
                        onClick={() => {
                          setOrder(
                            headCell.id === orderBy && order === "asc"
                              ? "desc"
                              : "asc"
                          );
                          setOrderBy(headCell.id);
                        }}
                      >
                        <Typography level="body1">{headCell.label}</Typography>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              {items && (
                <tbody>
                  {items
                    .slice(
                      page * itemsPerPage,
                      Math.min((page + 1) * itemsPerPage, items.length)
                    )
                    .map((item) => (
                      <tr
                        key={`${item[defaultOrderBy]}`}
                        onClick={() => setClickedItem(item)}
                      >
                        {headCells.map((headCell) => (
                          <td key={headCell.id.toString()}>
                            <Typography level="body2">
                              {`${item[headCell.id]}`}
                            </Typography>
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              )}

              {items && (
                <tfoot>
                  <tr>
                    <td colSpan={headCells.length}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          justifyContent: "flex-end",
                        }}
                      >
                        <FormControl orientation="horizontal" size="sm">
                          <FormLabel>Rows per page:</FormLabel>
                          <Select
                            onChange={(e, newValue) =>
                              setItemsPerPage(newValue || 10)
                            }
                            value={itemsPerPage}
                          >
                            <Option value={5}>5</Option>
                            <Option value={10}>10</Option>
                            <Option value={20}>20</Option>
                          </Select>
                        </FormControl>
                        <Typography textAlign="center" sx={{ minWidth: 80 }}>
                          {itemsPerPage * page + 1} to{" "}
                          {Math.min(itemsPerPage * (page + 1), items.length)} of{" "}
                          {items.length}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            size="sm"
                            color="neutral"
                            variant="outlined"
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                          >
                            <KeyboardArrowLeft />
                          </IconButton>
                          <IconButton
                            size="sm"
                            color="neutral"
                            variant="outlined"
                            disabled={
                              page >= Math.ceil(items.length / itemsPerPage) - 1
                            }
                            onClick={() => setPage(page + 1)}
                          >
                            <KeyboardArrowRight />
                          </IconButton>
                        </Box>
                      </Box>
                    </td>
                  </tr>
                </tfoot>
              )}
            </Table>
          </Sheet>
        </Grid>
      </Grid>
      <UpsertModal
        token={token}
        name={name}
        headCells={headCells}
        schemaId={schemaId}
        open={insertModalOpen}
        onClose={() => {
          setInsertModalOpen(false);
          fetchItems();
        }}
        primaryKey={defaultOrderBy}
        existingItem={null}
      />
      {OnClickModal && (
        <OnClickModal
          token={token}
          name={name}
          headCells={headCells}
          schemaId={schemaId}
          open={clickedItem !== null}
          onClose={() => {
            setClickedItem(null);
            fetchItems();
          }}
          primaryKey={defaultOrderBy}
          existingItem={clickedItem}
        />
      )}
    </Container>
  );
}

export default SortedTable;
