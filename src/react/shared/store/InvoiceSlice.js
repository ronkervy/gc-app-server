import { createSlice } from '@reduxjs/toolkit';
import { CreateInvoice } from './InvoiceService';

const InvoiceSlice = createSlice({
    name : 'invoice',
    initialState : {
        entities : [],
        pdf : [],
        error : '',
        loading : true
    },
    reducers : {},
    extraReducers : (builder)=>{
        builder.addCase(CreateInvoice.pending,state=>{
            state.loading = true;
        })
        .addCase(CreateInvoice.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.pdf = payload;
        })
        .addCase(CreateInvoice.rejected,(state,{payload})=>{
            state.loading = false;
            state.error = payload;
        })
    }
});

export default InvoiceSlice.reducer;