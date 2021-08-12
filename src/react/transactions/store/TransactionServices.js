import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const host = process.env.REACT_APP_HOST ? process.env.REACT_APP_HOST : 'localhost';

const TransServices = axios.create({
    baseURL : `http://localhost:8081/api/v1`,
    timeout : 60 * 2 * 1000
});

const sleep = (x)=>{
    return new Promise(resolve=>setTimeout(resolve,x));
}

export const getAllTransaction = createAsyncThunk(
    'transactions/getAllTransaction',
    async(args,{ rejectWithValue })=>{
        const { opt } = args;
        try{
            const res = await TransServices({
                ...opt,
                method : 'GET'
            });
            await sleep(2000);
            return res.data;
        }catch(err){
            return rejectWithValue(err);
        }
    }
);

export const getSingleTransaction = createAsyncThunk(
    'transactions/getSingleTransaction',
    async(args, {rejectWithValue})=>{
        const { opt } = args;
        try{
            const res = await TransServices({
                ...opt,
                method : 'GET'
            });
            await sleep(2000);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

export const createTransaction = createAsyncThunk(
    'transactions/createTransaction',
    async(args,{ rejectWithValue })=>{
        const { opt,values } = args;
        try{
            const res = await TransServices({
                ...opt,
                method : 'POST',
                data : values
            });
            await sleep(2000);
            return res.data;
        }catch(err){
            return rejectWithValue(err);
        }
    }
);

export const findTransaction = createAsyncThunk(
    'transactions/findTransaction',
    async( args, { rejectWithValue,dispatch } )=>{
        const { opt } = args;
        try{
            const res = await TransServices({
                ...opt,
                method : 'GET'
            });
            await sleep(2000);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

export const updateTransaction = createAsyncThunk(
    'transactions/updateTransaction',
    async(args,{rejectWithValue})=>{
        try{
            const { opt } = args;
            const res = await TransServices({
                ...opt,
                method : 'PATCH'
            });
            await sleep(2000);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

export const deleteTransaction = createAsyncThunk(
    'transactions/deleteTransaction',
    async(args,{rejectWithValue})=>{
        try{
            const { opt } = args;
            const res = await TransServices({
                ...opt,
                method : 'DELETE'
            });
            await sleep(2000);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

export const GetTransChart = createAsyncThunk(
    'transactions/GetTransChart',
    async(url,{rejectWithValue})=>{
        try{
            const res = await TransServices({
                url,
                method : 'GET'
            });
            await sleep(1000);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);