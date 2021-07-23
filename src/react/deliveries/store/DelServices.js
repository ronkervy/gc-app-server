import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const sleep = (ms)=>{
    return new Promise(resolve=>setTimeout(resolve,ms));
}

const DeliverService = axios.create({
    baseURL : `http://localhost:8081/api/v1`,
});

export const GetAllDeliveries = createAsyncThunk(
    'deliveries/GetAllDeliveries',
    async(args,{rejectWithValue})=>{
        try{
            const { opt } = args;
            const res = await DeliverService({
                ...opt,
                method : 'GET'
            });
            await sleep(1000);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

export const GetSingleDelivery = createAsyncThunk(
    'deliveries/GetSingleDelivery',
    async(args,{rejectWithValue})=>{
        try{
            const { opt } = args;
            const res = await DeliverService({
                ...opt,
                method : 'GET'
            });
            await sleep(1000);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

export const UpdateDeliveryStatus = createAsyncThunk(
    'deliveries/UpdateDeliveryStatus',
    async(args,{rejectWithValue})=>{
        try{
            const { opt,values } = args;
            const res = await DeliverService({
                ...opt,
                method : 'PATCH',
                data : values
            });
            await sleep(1000);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

export const CreateDelivery = createAsyncThunk(
    'deliveries/CreateDelivery',
    async(args,{rejectWithValue})=>{
        try{
            const { opt,values } = args;
            console.log(values);
            const res = await DeliverService({
                ...opt,
                method : 'POST',
                data : values
            });
            await sleep(1000);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

export const DeleteDelivery = createAsyncThunk(
    'deliveries/DeleteDelivery',
    async(args,{rejectWithValue})=>{
        try{
            const { opt } = args;
            const res = await DeliverService({
                ...opt,
                method : 'DELETE'
            });
            await sleep(1000);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);