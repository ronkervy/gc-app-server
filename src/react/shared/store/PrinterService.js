import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const host = process.env.REACT_APP_HOST ? process.env.REACT_APP_HOST : 'localhost';

const PrinterServices = axios.create({
    baseURL : `http://${host}:8081/api/v1/printers`
});

export const getAllPrinters = createAsyncThunk(
    'printers/getAllPrinters',
    async(args,{rejectWithValue})=>{
        try{
            const { opt } = args;
            const res = await PrinterServices({
                ...opt,
                method : 'GET'
            });
            return res.data;
        }catch(err){
            return rejectWithValue(err);
        }
    }
);