import { createSlice } from '@reduxjs/toolkit';
import { createTransaction, createTransactionReport, deleteTransaction, findTransaction, getAllTransaction,getSingleTransaction,GetTransChart,updateTransaction } from './TransactionServices';

const TransactionSlice = createSlice({
    name : 'transactions',
    initialState : {
        entities : [],
        loading : false,
        errors : null,
        charttransrpt : [],
        doc : ''
    },
    reducers : {},
    extraReducers : (builder)=>{
        //FETCH ALL TRANSACTIONS
        builder.addCase(getAllTransaction.pending,state=>{
            state.loading = true;
        })
        .addCase(getAllTransaction.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(getAllTransaction.rejected,(state,{payload})=>{
            state.loading = false;
            state.errors = payload;
        })
        //FIND TRANSACTIONS
        .addCase(findTransaction.pending,state=>{
            state.loading = true;
        })
        .addCase(findTransaction.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(findTransaction.rejected,(state,{payload})=>{
            state.loading = false;
            state.errors = payload;
        })
        //GET SINGLE TRANSACTIONS
        .addCase(getSingleTransaction.pending,state=>{
            state.loading = true;
        })
        .addCase(getSingleTransaction.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(getSingleTransaction.rejected,(state,{payload})=>{
            state.loading = false;
            state.errors = payload;
        })
        //GET TRANS CHART RPT
        .addCase(GetTransChart.pending,state=>{
            state.loading = true;
        })
        .addCase(GetTransChart.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.charttransrpt = payload;
        })
        .addCase(GetTransChart.rejected,(state,{payload})=>{
            state.loading = false;
            state.errors = payload;
        })
        //CREATE TRANSACTION
        .addCase(createTransaction.pending,state=>{
            state.loading = true;
        })
        .addCase(createTransaction.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities[payload._id] = payload;
        })
        .addCase(createTransaction.rejected,(state,{payload})=>{
            state.loading = false;
            state.errors = payload;
        })
        //CREATE TRANSACTION REPORT
        .addCase(createTransactionReport.pending,state=>{
            state.loading = true;
        })
        .addCase(createTransactionReport.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.doc = payload;
        })
        .addCase(createTransactionReport.rejected,(state,{payload})=>{
            state.loading = false;
            state.doc = '';
            state.errors = payload;
        })
        //UPDATE TRANSACTION
        .addCase(updateTransaction.pending,state=>{
            state.loading = true;
        })
        .addCase(updateTransaction.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(updateTransaction.rejected,(state,{payload})=>{
            state.loading = false;
            state.errors = payload;
        })
        //DELETE TRANSACTION
        .addCase(deleteTransaction.pending,state=>{
            state.loading = true;
        })
        .addCase(deleteTransaction.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(deleteTransaction.rejected,(state,{payload})=>{
            state.loading = false;
            state.errors = payload;
        })
    }
});

export default TransactionSlice.reducer;