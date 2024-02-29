import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { Config } from "./Context";
import Grid from '@material-ui/core/Grid';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel } from '@material-ui/core';



const AbsenceTable = () => {

  const [sortDirection, setSortDirection] = useState('asc');
  const [sortedField, setSortedField] = useState('');

    const { values } = useSelector((state) => state.absences);

    console.log(values);

    const employeeName = values.map((entry) => `${entry.employee.firstName} ${entry.employee.lastName}`);
    console.log(employeeName);

    const handleSort = (field) => {
      //check for strict equality on boolean result
      const isAsc = sortedField === field && sortDirection === 'asc';
      //determine wether the current sorting order is true OR false
      setSortDirection(isAsc ? 'desc' : 'asc');
      setSortedField(field);
    };

    const sortedValues = [...values].sort((a, b) => {

      const nameA = `${a.employee.firstName} ${a.employee.lastName}`;
      const nameB = `${b.employee.firstName} ${b.employee.lastName}`;

      if (sortDirection === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
    

    return (
      <Grid container justifyContent="center">
        <Grid item xs={6}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sortedField === 'employeeName'}
                      direction={sortDirection}
                      onClick={() => handleSort('employeeName')}
                    >
                      Employee Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Approval</TableCell>
                  <TableCell>Absence Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedValues.map((x) => (
                  <TableRow>
                    <TableCell>{`${x.employee.firstName} ${x.employee.lastName}`}</TableCell>
                  <TableCell>{x.startDate}</TableCell>
                  <TableCell>{x.endDate}</TableCell>
                  <TableCell>{x.approved.toString()}</TableCell>
                  <TableCell>{x.absenceType}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    );
}

export default AbsenceTable;