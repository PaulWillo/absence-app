import React, { useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
} from "@material-ui/core";
import { calculateFutureDates, getMultipleStartDates } from "../service/utils";
import { Language } from "./Context";

const ExpandedTable = ({ expandedRow, index, data, findConflict }) => {
  const language = useContext(Language);
  const headers = language.tableHeaders.expandedTableHeaders;

  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
        <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="multiple-start-dates">
              <TableHead>
                <TableRow>
                  <TableCell>{headers.exStartDates}</TableCell>
                  <TableCell>{headers.exAbsenceEndDates}</TableCell>
                  <TableCell>{headers.exConflicts}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getMultipleStartDates(data.multipleStartDates).map(
                  (startDate, i) => (
                    //this is a bit of a mess, I have to iterate through the above to map values correctly
                    //if I could turn back the clock a few hours I would of loaded the data better in redux (cleanse it on load)
                    <TableRow key={i}>
                      <TableCell>{startDate}</TableCell>
                      <TableCell>
                        {
                          calculateFutureDates(
                            data.multipleStartDates,
                            data.multipleDays
                          )[i]
                        }
                      </TableCell>
                      <TableCell>
                        {findConflict ? "This employee has conflicts!" : null}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </TableCell>
    </TableRow>
  );
};

export default ExpandedTable;
