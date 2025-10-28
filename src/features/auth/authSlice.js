import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  user: null,
  currentPage: 'home',
  pageConversations: {},
  selectedIndustry: null,
  selectedRole: null,
  roles: [],
  isAdmin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },

    setUser(state, action) {
      state.user = action.payload;
      // Update selected industry and role if provided in user data
      if (action.payload) {
        state.selectedIndustry = action.payload.selectedIndustry || null;
        state.selectedRole = action.payload.selectedRole || null;
        
        // Extract roles from user payload if available
        if (action.payload.roles) {
          state.roles = action.payload.roles;
          // Set isAdmin flag if roles include admin (case insensitive)
          state.isAdmin = state.roles.some(role => 
            role.toLowerCase().includes('admin')
          );
        }
      }
    },

    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },

    setPageConversation(state, action) {
      const { page, conversationId } = action.payload;
      state.pageConversations[page] = conversationId;
    },

    clearPageConversation(state, action) {
      const page = action.payload;
      state.pageConversations[page] = null;
    },

    setSelectedIndustry(state, action) {
      state.selectedIndustry = action.payload;
      state.pageConversations = {};
    },

    setSelectedRole(state, action) {
      state.pageConversations = {};
      state.selectedRole = action.payload;
    },

    clearUserSelections(state) {
      state.selectedIndustry = null;
      state.selectedRole = null;
      state.pageConversations = {};
    },

    resetAuth() {
      return initialState;
    },
  },
});

// Export actions
export const {
  setLoading,
  setUser,
  setCurrentPage,
  setPageConversation,
  clearPageConversation,
  setSelectedIndustry,
  setSelectedRole,
  clearUserSelections,
  resetAuth,
} = authSlice.actions;

// Export selectors
export const selectUser = (state) => state.auth.user;
export const selectCurrentPage = (state) => state.auth.currentPage;
export const selectPageConversation = (state, page) => state.auth.pageConversations[page];
export const selectCurrentPageConversation = (state) => state.auth.pageConversations[state.auth.currentPage] || null;
export const selectSelectedIndustry = (state) => state.auth.selectedIndustry;
export const selectSelectedRole = (state) => state.auth.selectedRole;
export const selectLoading = (state) => state.auth.loading;
export const selectUserRoles = (state) => state.auth.roles;
export const selectIsAdmin = (state) => state.auth.isAdmin;

export default authSlice.reducer;
