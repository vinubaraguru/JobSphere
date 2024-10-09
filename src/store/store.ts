import { configureStore } from '@reduxjs/toolkit'
import userReducer, { persistUsersMiddleware } from '../features/user-slice'
import jobReducer, { persistJobsMiddleware } from '../features/job-slice'

const store = configureStore({
  reducer: {
    jobs: jobReducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistJobsMiddleware, persistUsersMiddleware), // Combine middlewares
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;