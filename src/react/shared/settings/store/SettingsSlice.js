import { createSlice } from '@reduxjs/toolkit';
import { getSettings, saveSettings } from './SettingsService';

const SettingsSlice = createSlice({
    name : "settings",
    initialState : {
        entities : [],
        loading : true,
        errors : ''
    },
    reducers : {},
    extraReducers : builder=>{
        
        //Get Settings
        builder.addCase(getSettings.pending,state=>{
            state.loading = true;
        })
        .addCase(getSettings.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(getSettings.rejected,(state,{payload})=>{
            state.loading = false;
            state.errors = payload;
        })
        //Save Settings
        .addCase(saveSettings.pending,state=>{
            state.loading = true;
        })
        .addCase(saveSettings.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(saveSettings.rejected,(state,{payload})=>{
            state.loading = false;
            state.errors = payload;
        })
    }
});

export default SettingsSlice.reducer;