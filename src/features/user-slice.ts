import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import users from '../MockData/userMockData';

// type UserType = 'Freelancer' | 'Employer';

interface Project {
  id: string;
  projectName: string;
}
export interface User {
  id?: string;
  userType: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  skills?: string[];
  currentSalary?: string;
  expectedSalary?: string;
  githubLink?: string;
  projects?: Project[];
  appliedJobs?: string[];
}

interface LoggedInUserInfo {
  user: any;
  isAuthenticated: boolean;
}

interface UserState {
  usersList: User[];
  loggedInUserInfo: LoggedInUserInfo;
}

const initialState: UserState = {
  usersList: localStorage.getItem('users') 
    ? JSON.parse(localStorage.getItem('users') as string) 
    : [...users],
  loggedInUserInfo: {
    user: localStorage.getItem('loggedInUser') 
      ? JSON.parse(localStorage.getItem('loggedInUser') as string) 
      : null,
    isAuthenticated: !!localStorage.getItem('loggedInUser'),
  },
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      const newUser: User = {
        id: uuidv4(),
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        userType: action.payload.userType,
        email: action.payload.email,
        password: action.payload.password,
        phoneNumber: action.payload.phoneNumber,
      };
      state.usersList.push(newUser);
    },
    updateUser: (state, action) => {
      const { id, userId } = action.payload;
      const user = state.usersList.find((user) => user.id === userId);
      if (user) {
        user.appliedJobs = user.appliedJobs?.length 
          ? [...user.appliedJobs, id] 
          : [id];
      }
    },
    updateProfile: (state, action) => {
      const { userId, updatedUserProfileData } = action.payload;
      const user = state.usersList.find((user) => user.id === userId);
      if (user) {
        Object.assign(user, updatedUserProfileData);
      }
    },
    login: (state, action) => {
      state.loggedInUserInfo = {
        user: action.payload,
        isAuthenticated: true,
      };
    },
    logout: (state) => {
      state.loggedInUserInfo = {
        user: null,
        isAuthenticated: false,
      };
    },
  },
});

// Middleware to persist user state to localStorage
const persistUsersMiddleware = (storeAPI: any) => (next: any) => (action: any) => {
  const result = next(action);
  const state = storeAPI.getState();
  localStorage.setItem('users', JSON.stringify(state.users.usersList));
  if (state.users.loggedInUserInfo.isAuthenticated) {
    const finUser =  state.users.usersList.find(
      (user: User) =>
        user.id === state.users.loggedInUserInfo.user.id);
    localStorage.setItem('loggedInUser', JSON.stringify(finUser));
  } else {
    localStorage.removeItem('loggedInUser');
  }
  return result;
};

export const { addUser, updateUser, updateProfile, login, logout } = userSlice.actions;
export default userSlice.reducer;
export { persistUsersMiddleware };

export const selectUserExists = (state: UserState, email: string, userType: string) =>
  state.usersList.some((user) => user.email === email && user.userType === userType);
