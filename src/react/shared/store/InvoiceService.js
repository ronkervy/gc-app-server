import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const host = process.env.REACT_APP_HOST ? process.env.REACT_APP_HOST : 'localhost';

const sleep = (ms)=>{
    return new Promise(resolve=>setTimeout(resolve,ms));
}

const InvoiceService = axios.create({
    baseURL : `http://${host}:8081/api/v1/gc-print`
});

export const CreateInvoice = createAsyncThunk(
    'invoice/CreateInvoice',
    async(args,{rejectWithValue})=>{
        try{
            const { opt } = args;
            const res = await InvoiceService({
                ...opt,
                method : 'GET'                
            });
            return res.data;
        }catch(err){
            alert(err.response.data);
            return rejectWithValue(err.response.data);
        }
    }
);