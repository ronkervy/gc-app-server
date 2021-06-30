import { createSlice } from '@reduxjs/toolkit';
import {
    getAllSuppliers,
    getSingleSupplier,
    findSupplier,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplierProducts
} from './SupplierServices';

const SupplierSlice = createSlice({
    name : 'suppliers',
    initialState : {
        entities : [],
        loading : false,
        error : ''
    },

    reducers : {},
    extraReducers : (builder)=>{
        //GET ALL SUPPLIERS
        builder.addCase(getAllSuppliers.pending,state=>{
            state.loading = true;
        })
        .addCase(getAllSuppliers.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(getAllSuppliers.rejected,(state,{payload})=>{
            state.loading = false;
            state.entities = [];
            state.error = payload;
        })
        //GET SINGLE SUPPLIER
        .addCase(getSingleSupplier.pending,state=>{
            state.loading = true;
        })
        .addCase(getSingleSupplier.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(getSingleSupplier.rejected,(state,{payload})=>{
            state.loading = false;
            state.entities = [];
            state.error = payload;
        })
        //GET SUPPLIERS PRODUCTS
        .addCase(getSupplierProducts.pending,state=>{
            state.loading = true;
        })
        .addCase(getSupplierProducts.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(getSupplierProducts.rejected,(state,{payload})=>{
            state.loading = false;
            state.error = payload;
        })
        //FIND SUPPLIER
        .addCase(findSupplier.pending,state=>{
            state.loading = true;
        })
        .addCase(findSupplier.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(findSupplier.rejected,(state,{payload})=>{
            state.loading = false;
            state.error = payload;
        })
        //CREATE SUPPLIER
        .addCase(createSupplier.pending,state=>{
            state.loading = true;
        })
        .addCase(createSupplier.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities[payload._id] = payload;
        })
        .addCase(createSupplier.rejected,(state,{payload})=>{
            state.loading = false;
            state.error = payload;
        })
        //UPDATE SUPPLIER
        .addCase(updateSupplier.pending,state=>{
            state.loading = true;
        })
        .addCase(updateSupplier.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(updateSupplier.rejected,(state,{payload})=>{
            state.loading = false;
            state.error = payload;
        })
        //DELETE SUPPLIER
        .addCase(deleteSupplier.pending,state=>{
            state.loading = true;
        })
        .addCase(deleteSupplier.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(deleteSupplier.rejected,(state,{payload})=>{
            state.loading = false;
            state.error = payload;
        })
    }
});

export default SupplierSlice.reducer;
