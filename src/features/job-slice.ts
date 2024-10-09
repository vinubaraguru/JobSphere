import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import jobs from '../MockData/jobsMockData';

export interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  requiredSkills: string[];
  company: string;
  location: string;
  createdby: string;
  updatedby: string;
  appliedUsers: string[];
  offeredSalary: number;
  createdAt: string;
}

interface JobState {
  jobList: Job[];
}

const initialState: JobState = {
  jobList: localStorage.getItem('jobs')
    ? JSON.parse(localStorage.getItem('jobs') as string)
    : [...jobs],
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    // Post a new job
    postJob: (state, action) => {
      const {
        title,
        description,
        status = 'open',  // Default to 'open' status if not provided
        requiredSkills = [],
        company,
        location,
        createdby,
        updatedby,
        offeredSalary,
        createdAt = new Date().toISOString(),
      } = action.payload;

      const newJob: Job = {
        id: uuidv4(),
        title,
        description,
        status,
        requiredSkills,
        company,
        location,
        createdby,
        updatedby,
        appliedUsers: [],
        offeredSalary,
        createdAt,
      };

      state.jobList.push(newJob);
    },
    // Apply to a job
    applyJob: (state, action) => {
      const { id, userId } = action.payload;
      const job = state.jobList.find((job) => job.id === id);

      if (job && !job.appliedUsers.includes(userId)) {
        job.appliedUsers.push(userId);
      }
    },
  },
});

// Middleware to persist jobs to localStorage after every action
const persistJobsMiddleware = (storeAPI: any) => (next: any) => (action: any) => {
  const result = next(action);
  const state = storeAPI.getState();
  localStorage.setItem('jobs', JSON.stringify(state.jobs.jobList));
  return result;
};

export const { postJob, applyJob } = jobSlice.actions;
export default jobSlice.reducer;
export { persistJobsMiddleware };
