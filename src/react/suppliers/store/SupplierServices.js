import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const Sleep = (ms)=>{
    return new Promise((resolve)=>setTimeout(resolve,ms));
}

const host = process.env.REACT_APP_HOST ? process.env.REACT_APP_HOST : 'localhost';

const suppServices = axios.create({
    baseURL : `http://${host}:8081/api/v1`,
    timeout : 60 * 2 * 1000
});

export const getAllSuppliers = createAsyncThunk(
    'suppliers/getAllSuppliers',
    async(args,{rejectWithValue})=>{
        const { opt } = args;
        try{
            const res = await suppServices({
                ...opt,
                method : 'GET'
            });
            await Sleep(1000);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

export const getSupplierProducts = createAsyncThunk(
    'suppliers/getSupplierProducts',
    async( args,{rejectWithValue} )=>{
        const { opt,name } = args;
        try{
            const res = await suppServices({
                ...opt,
                method : 'GET',
                params : {
                    name
                }
            });
            await Sleep(1000);
            return res.data;
        }catch(err){    
            return rejectWithValue(err.response.data);
        }
    }
);

export const getSingleSupplier = createAsyncThunk(
    'suppliers/getSingleSupplier',
    async( args, { rejectWithValue } )=>{
        const { opt } = args;
        try{
            const res = await suppServices({
                ...opt,
                method : 'GET'
            });
            await Sleep(1000);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

export const findSupplier = createAsyncThunk(
    'suppliers/findSupplier',
    async( args, { rejectWithValue } )=>{
        const { opt } = args;
        try{
            const res = await suppServices({
                ...opt,
                method : "GET"
            });
            await Sleep(1000);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

export const createSupplier = createAsyncThunk(
    'suppliers/createSupplier',
    async( args, { rejectWithValue } )=>{
        const { opt, values } = args;
        try{
            const res = await suppServices({
                ...opt,
                method : 'POST',
                data : values
            });
            await Sleep(1000);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

export const updateSupplier = createAsyncThunk(
    'suppliers/updateSupplier',
    async( args, { rejectWithValue } )=>{
        const { opt,values } = args;
        try{
            const res = await suppServices({
                ...opt,
                method : 'PATCH',
                data : values
            });
            await Sleep(1000);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

export const deleteSupplier = createAsyncThunk(
    'suppliers/deleteSupplier',
    async( args, { rejectWithValue } )=>{
        const { opt } = args;
        try{
            const res = await suppServices({
                ...opt,
                method : 'DELETE'
            });
            await Sleep(1000);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);