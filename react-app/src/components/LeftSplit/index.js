import { useCallback, useEffect, useState } from 'react';
import { getAnnotations } from '../../utils';
import { detectFromUrl } from '../../api';
import { useSelector, useDispatch } from 'react-redux';
import BoundingBox from '../BoundingBox';
import {
  Grid,
  Paper,
  Slider,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { Box } from '@mui/system';
import {
  setDetections,
  setHoveredDetection,
  setScoreThreshold,
  setVerticalSortThreshold
} from '../../store/actions';

const LeftSplit = () => {
  const detections = useSelector((state) => state.ui.detections);
  const scoreThreshold = useSelector((state) => state.ui.scoreThreshold);
  const verticalSortThreshold = useSelector(
    (state) => state.ui.verticalSortThreshold
  );
  const dispatch = useDispatch();
  const [url, setUrl] = useState('');

  //   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfyaogc5c4ZphfImbm1u9SmfUIJPZVllhkXw&usqp=CAU'
  const onSubmit = (e) => {
    setUrl(e.target.value);
    dispatch(setDetections([]));
    detectFromUrl(e.target.value).then(
      ({ detections: { boxes, scores, classes } }) => {
        dispatch(setDetections(getAnnotations(classes, boxes, scores)));
      }
    );
  };

  const handleMinAccChange = (event, newValue) => {
    if (typeof newValue === 'number') {
      dispatch(setScoreThreshold(newValue));
    }
  };

  const handleSortThresholdChange = (event, newValue) => {
    if (typeof newValue === 'number') {
      dispatch(setVerticalSortThreshold(newValue));
    }
  };

  return (
    <Box
      sx={{
        margin: 4,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        component="div"
        // sx={{ p: 2, pb: 0 }}
      >
        Input
      </Typography>
      <TextField
        sx={{ mb: 2 }}
        label="Image URL"
        margin="normal"
        onBlur={onSubmit}
      />
      <Stack direction="row" sx={{ mb: 2 }} spacing={2} alignItems="center">
        <Typography>Minimum Accuracy:</Typography>
        <Slider
          step={0.01}
          min={0}
          max={1}
          value={scoreThreshold}
          onChange={handleMinAccChange}
          valueLabelDisplay="auto"
        />
        <Typography>{scoreThreshold}</Typography>
      </Stack>

      <Stack direction="row" sx={{ mb: 2 }} spacing={2} alignItems="center">
        <Typography>Vertical Sort Threshold:</Typography>
        <Slider
          step={0.01}
          min={0}
          max={1}
          value={verticalSortThreshold}
          onChange={handleSortThresholdChange}
          valueLabelDisplay="auto"
        />
        <Typography>{verticalSortThreshold}</Typography>
      </Stack>

      {detections && (
        <BoundingBox
          image={url}
          scoreThreshold={scoreThreshold}
          detections={detections}
          onSelected={(i) => dispatch(setHoveredDetection(i))}
        />
      )}
    </Box>
  );
};

export default LeftSplit;
