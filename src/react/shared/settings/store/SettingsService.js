import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const SettingsServices = axios.create({
    baseURL : `http://localhost:8081/api/v1/settings`,
    timeout : 1000
});

const sleep = (x)=>{
    return new Promise((resolve)=>setTimeout(resolve,x));
}

export const getSettings = createAsyncThunk(
    'settings/getSettings',
    async(args,{rejectWithValue})=>{
        try{
            const res = await SettingsServices({
                method : 'GET'
            });
            await sleep(2000);
            return res.data;
        }catch(err){    
            return rejectWithValue(err.response.data);
        }
    }
);

export const saveSettings = createAsyncThunk(
    'settings/saveSettings',
    async(args,{rejectWithValue})=>{
        try{
            const {settings} = args;
            const res = await SettingsServices({
                method : "POST",
                data : settings
            });
            await sleep(2000);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);