import { createSlice } from '@reduxjs/toolkit';



const initialState = {
    isLoginModalShown: false,
    isLoginSessionExpired: false,
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
        }
    }
});

export const {
    _setLoginModalShown,
    _setLoginSessionExpired
} = ui.actions;



export default ui.reducer;