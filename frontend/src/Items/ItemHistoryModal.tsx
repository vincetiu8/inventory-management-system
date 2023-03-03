import {
  Button,
  Grid,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  Typography,
} from "@mui/joy";
import React, { useEffect, useState } from "react";
import {
  HorizontalGridLines,
  LineSeries,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
} from "react-vis";
import axios from "axios";
import UpsertModal, { UpsertModalProps } from "../Assets/UpsertModal";
import { IItem, ITransaction } from "../Assets/models";

/**
 * Modal for displaying the history of an item's quantity
 * @param props - the props
 * @constructor
 */
function ItemHistoryModal(props: UpsertModalProps<IItem>) {
  const { token, existingItem, open, onClose } = props;

  const [showUpdate, setShowUpdate] = useState(false);

  const [historyDays, setHistoryDays] = useState(30);
  const [itemHistory, setItemHistory] = useState<{ x: Date; y: number }[]>([]);
  const [maxQuantity, setMaxQuantity] = useState(0);

  async function fetchItemHistory() {
    if (!existingItem) return;

    const resp = await axios.get(`api/txs/item/${existingItem?.itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const filteredData = resp.data.filter((tx: ITransaction) => {
      const txDate = new Date(tx.date);
      return (
        new Date().setDate(new Date().getDate() - historyDays) <
        txDate.getTime()
      );
    });

    const data = [];
    let quantity = existingItem?.quantity;
    let maxQuant = quantity;
    data.push({
      x: new Date(new Date().setDate(new Date().getDate())),
      y: quantity,
    });
    for (let i = 0; i < filteredData.length; i += 1) {
      const tx = filteredData[i];
      const txDate = new Date(tx.date);
      const txQuantity = tx.quantity;
      data.push({ x: txDate, y: quantity });
      quantity -= txQuantity;
      maxQuant = Math.max(maxQuant, quantity);
    }
    data.push({
      x: new Date(new Date().setDate(new Date().getDate() - historyDays)),
      y: quantity,
    });

    setItemHistory(data);
    setMaxQuantity(maxQuant);
  }

  useEffect(() => {
    fetchItemHistory();
  }, [existingItem, historyDays]);

  if (showUpdate) {
    return (
      <UpsertModal
        {...{ ...props, open: showUpdate, onClose: () => setShowUpdate(false) }}
      />
    );
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <ModalClose onClick={onClose} />
        <Grid container justifyContent="space-between">
          <Grid>
            <Typography level="h4">
              Item History: {existingItem?.name}
            </Typography>
          </Grid>
          <Grid>
            <Grid
              container
              alignItems="center"
              spacing={2}
              sx={{ marginRight: 3 }}
            >
              <Grid>
                <Typography level="h5">Timeframe:</Typography>
              </Grid>
              <Grid>
                <Select
                  onChange={(e, newValue) => setHistoryDays(newValue || 30)}
                  value={historyDays}
                >
                  <Option value={7}>1 Week</Option>
                  <Option value={30}>1 Month</Option>
                  <Option value={365}>1 Year</Option>
                </Select>
              </Grid>
              <Grid>
                <Button onClick={() => setShowUpdate(true)}>Update Item</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <XYPlot
          width={800}
          height={600}
          xType="time"
          xDomain={[
            new Date().setDate(new Date().getDate() - historyDays),
            new Date(),
          ]}
          yDomain={[0, Math.round(maxQuantity * 1.1)]}
        >
          <HorizontalGridLines />
          <VerticalGridLines />
          <XAxis title="Time" />
          <YAxis title="Quantity" left={0} />
          {/* This works, but the typescript types aren't updated to accept dates in the line series for some reason */}
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <LineSeries data={itemHistory} fill={undefined} />
        </XYPlot>
      </ModalDialog>
    </Modal>
  );
}

export default ItemHistoryModal;
