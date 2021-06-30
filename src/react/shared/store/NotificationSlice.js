import { createSlice } from '@reduxjs/toolkit';

const NotificationSlice = createSlice({
    'name' : 'notifications',
    initialState : {
        open : false,
        message : '',
        severity : ''
    },
    reducers : {
        OpenNotification : (state,{payload})=>{
            state.open = true;
            state.severity = payload.severity;
            state.message = payload.message;
        },
        CloseNotification : (state,{payload})=>{
            state.open = false;
            state.severity = '';
            state.message = '';
        }
    }
});

export const { OpenNotification,CloseNotification } = NotificationSlice.actions;

export default NotificationSlice.reducer;