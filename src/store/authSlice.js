import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/api';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await authService.login(credentials);
    localStorage.setItem('nexus_token', data.token);
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed. Please check your credentials.');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await authService.register(userData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed. Please try again.');
  }
});

export const verifyEmail = createAsyncThunk('auth/verifyEmail', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await authService.verify(payload);
    localStorage.setItem('nexus_token', data.token);
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Invalid verification code.');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try { await authService.logout(); } catch (_) {}
  localStorage.removeItem('nexus_token');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:         null,
    token:        localStorage.getItem('nexus_token') || null,
    loading:      false,
    error:        null,
    emailPending: false,
  },
  reducers: {
    clearError(state)        { state.error = null; },
    setUser(state, action)   { state.user  = action.payload; },
  },
  extraReducers: (builder) => {
    // login
    builder
      .addCase(loginUser.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(loginUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; s.token = localStorage.getItem('nexus_token'); })
      .addCase(loginUser.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });
    // register
    builder
      .addCase(registerUser.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(registerUser.fulfilled, (s) => { s.loading = false; s.emailPending = true; })
      .addCase(registerUser.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });
    // verify email
    builder
      .addCase(verifyEmail.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(verifyEmail.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; s.emailPending = false; s.token = localStorage.getItem('nexus_token'); })
      .addCase(verifyEmail.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });
    // logout
    builder.addCase(logoutUser.fulfilled, (s) => { s.user = null; s.token = null; });
  },
});

export const { clearError, setUser } = authSlice.actions;

// Selectors
export const selectUser         = (state) => state.auth.user;
export const selectToken        = (state) => state.auth.token;
export const selectAuthLoading  = (state) => state.auth.loading;
export const selectAuthError    = (state) => state.auth.error;
export const selectEmailPending = (state) => state.auth.emailPending;
export const selectIsLoggedIn   = (state) => !!state.auth.user;

export default authSlice.reducer;
