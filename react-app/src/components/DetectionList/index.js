import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useSelector, useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';

export default function DetectionList() {
  const detections = useSelector((state) => state.ui.detections);
  const scoreThreshold = useSelector((state) => state.ui.scoreThreshold);
  const hoveredDetection = useSelector((state) => state.ui.hoveredDetection);

  const StyledTableRow = styled(TableRow)(({ theme, focus }) => ({
    backgroundColor: focus ? theme.palette.action.selected : ''
  }));

  return (
    <Box sx={{ overflow: 'auto', m: 4 }}>
      <Typography variant="h5" gutterBottom component="div">
        Detections
      </Typography>
      <TableContainer>
        <Table stickyHeader sx={{ maxWidth: 400 }}>
          <TableHead>
            <TableRow>
              <TableCell>Label</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>y1</TableCell>
              <TableCell>x1</TableCell>
              <TableCell>y2</TableCell>
              <TableCell>x2</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {detections
              .filter((d) => d.score > scoreThreshold)
              .map((row) => (
                <StyledTableRow
                  focus={hoveredDetection?.id == row?.id}
                  key={row.id}
                >
                  <TableCell component="th" scope="row">
                    {row.label}
                  </TableCell>
                  <TableCell>{row.score.toString().slice(0, 4)}</TableCell>
                  {row.box.map((c) => (
                    <TableCell>{c.toFixed(3)}</TableCell>
                  ))}
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
