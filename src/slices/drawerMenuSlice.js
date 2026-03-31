import { createSlice } from '@reduxjs/toolkit';

const drawerMenuSlice = createSlice({
    name: 'drawerMenu',
    initialState: {
        isOpen: false,
    },
    reducers: {
        toggleDrawerMenu(state) {
            state.isOpen = !state.isOpen;
        },
    },
});

export const { toggleDrawerMenu } = drawerMenuSlice.actions;
export default drawerMenuSlice.reducer;
