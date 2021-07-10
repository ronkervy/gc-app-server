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
        CloseNotification : state=>{
            state.open = false;
        }
    }
});

export const { OpenNotification,CloseNotification } = NotificationSlice.actions;

export default NotificationSlice.reducer;