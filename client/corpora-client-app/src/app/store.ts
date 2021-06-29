import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import userReducer from '../slices/userSlice';
import uiReducer from '../slices/uiSlice';
import editionsReducer from '../slices/editionsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    ui: uiReducer,
    editions: editionsReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
