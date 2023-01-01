import { Box, Grid, Stack, TextField, Typography } from '@mui/material';
import { border } from '@mui/system';
import { useSelector, useDispatch } from 'react-redux';
import { sortDigits } from '../../utils';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';

const Output = () => {
  const [regex, setRegex] = useState('');
  const [format, setFormat] = useState('');
  const [output, setOutput] = useState('');
  const detections = useSelector((state) => state.ui.detections);
  const scoreThreshold = useSelector((state) => state.ui.scoreThreshold);
  const hoveredDetection = useSelector((state) => state.ui.hoveredDetection);
  const verticalSortThreshold = useSelector(
    (state) => state.ui.verticalSortThreshold
  );

  const StyledDigit = styled(Typography)(({ theme, active }) => ({
    // ...theme.typography.button,
    fontSize: 48,
    textDecoration: active && 'underline'
    // color: active ? theme.palette.warning.main : ''
  }));

  const handleRegexChange = (e) => {
    setRegex(e.target.value);
  };

  const handleFormatChange = (e) => {
    setFormat(e.target.value);
  };

  const digits = sortDigits({ scoreThreshold, verticalSortThreshold })(
    detections
  )
    .map((d) => d.label)
    .reduce((prev, curr) => prev + curr, '');

  const runRegExp = () => {
    try {
      return digits.replace(new RegExp(regex), format);
    } catch {
      return 'RegExp Error';
    }
  };

  useEffect(() => {
    setOutput(runRegExp());
  }, [digits, regex, format]);

  return (
    <Box
      sx={{
        margin: 2,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography>Sorted Digits:</Typography>
      <Stack direction="row">
        {detections &&
          sortDigits({ scoreThreshold, verticalSortThreshold })(detections).map(
            (d) => (
              <StyledDigit active={hoveredDetection?.id == d.id}>
                {d.label}
              </StyledDigit>
            )
          )}
      </Stack>

      <Typography mt={4} mb={2}>
        Regular Expression:
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField fullWidth label="Regex" onChange={handleRegexChange} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth label="Format" onChange={handleFormatChange} />
        </Grid>
      </Grid>

      <Typography mt={6}>Output:</Typography>
      <StyledDigit>{output}</StyledDigit>
    </Box>
  );
};
export default Output;
