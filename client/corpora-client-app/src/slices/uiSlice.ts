import { createSlice } from '@reduxjs/toolkit';



const initialState = {
    isLoginModalShown: false,
    isLoginSessionExpired: false,
    isLogoutModalShown: false,
    isSidebarOpen: false
}

const ui = createSlice({
    name: 'uiState',
    initialState,
    reducers: {
        _setLoginModalShown(state, action) {
            state.isLoginModalShown = action.payload
        },
        _setLoginSessionExpired(state, action) {
            state.isLoginSessionExpired = action.payload
        },
        _setLogoutModalShown(state, action) {
            state.isLogoutModalShown = action.payload
        },
        _setSidebarOpen(state, action) {
            state.isSidebarOpen = action.payload
        },
    }
});

export const {
    _setLoginModalShown,
    _setLoginSessionExpired,
    _setLogoutModalShown,
    _setSidebarOpen
} = ui.actions;



export default ui.reducer;