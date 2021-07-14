import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const Sleep = (ms)=>{
    return new Promise((resolve)=>setTimeout(resolve,ms));
}

const prodService = axios.create({
    baseURL : `http://localhost:8081/api/v1`,
    timeout : 60 * 2 * 1000
});

export const getProduct = createAsyncThunk(
    'products/getProduct',
    async(args,{rejectWithValue})=>{        
        try{
            const {opt} = args;
            const res = await prodService({
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

export const getProducts = createAsyncThunk(
    'products/getProducts',
    async (endpoint,{rejectWithValue,getState})=>{ 
        try{

            const res = await prodService({
                url : endpoint,
                method : "GET"
            });
            await Sleep(1000);
            return res.data;
            
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

export const findProduct = createAsyncThunk(
    'products/findProduct',
    async(args,{rejectWithValue})=>{
        const { opt } = args;
        try{
            const res = await prodService({
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

export const createProduct = createAsyncThunk(
    'products/createProduct',
    async(args,{rejectWithValue})=>{
        const { opt,values } = args;
        try{
            const res = await prodService({
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

export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async(args,{rejectWithValue})=>{
        const { opt, values } = args;
        try{
            const res = await prodService({
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

export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async(args,{rejectWithValue})=>{
        try{
            const { opt, item_id } = args;
            const res = await prodService({
                ...opt,
                method : 'DELETE',
                params : {
                    item_id
                }
            });
            await Sleep(1000);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

