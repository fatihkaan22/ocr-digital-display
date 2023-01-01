import { configureStore } from '@reduxjs/toolkit';
import annotationReducer from './actions.js';

export const store = configureStore({
  reducer: {
    ui: annotationReducer
  }
});
