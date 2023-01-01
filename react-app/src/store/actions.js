import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  annotations: [],
  activeAnnotations: [],
  detections: [],
  hoveredDetection: -1,
  scoreThreshold: 0.7,
  verticalSortThreshold: 0.1,
};

export const slice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    submit: (state, { payload: annotation }) => {
      const { geometry, data } = annotation;
      state.annotations = [
        ...state.annotations,
        {
          geometry,
          data: {
            ...data,
            id: Math.random()
          }
        }
      ];
    },
    setActiveAnnotations: (state, { payload }) => {
      state.activeAnnotations = payload;
    },
    setDetections: (state, { payload }) => {
      state.detections = payload;
    },
    setHoveredDetection: (state, { payload }) => {
      if (payload === undefined) return;
      if (payload == -1) {
        state.hoveredDetection = null;
        return;
      }
      state.hoveredDetection = state.detections[payload];
    },
    setScoreThreshold: (state, { payload }) => {
      state.scoreThreshold = payload;
    },
    setVerticalSortThreshold: (state, { payload }) => {
      state.verticalSortThreshold = payload;
    }
  }
});

export const {
  submit,
  setActiveAnnotations,
  setDetections,
  setHoveredDetection,
  setScoreThreshold,
  setVerticalSortThreshold
} = slice.actions;

export default slice.reducer;
