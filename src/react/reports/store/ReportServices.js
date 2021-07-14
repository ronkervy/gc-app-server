import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const urlHost = `http://localhost:8081/api/v1/reports`;

const sleep = (t)=>{
    return new Promise((resolve)=>setTimeout(resolve,t));
}

const ReportService = axios.create({
    baseURL : urlHost,
    timeout : 1000
});

export const generateReport = createAsyncThunk(
    'report/generateReport',
    async(args,{rejectWithValue})=>{
        try{
            const { url } = args;
            const res = await ReportService({
                url,
                method : 'GET'
            });
            await sleep(2000);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);