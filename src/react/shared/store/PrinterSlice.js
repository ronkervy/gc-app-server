import { createSlice } from '@reduxjs/toolkit';
import { getAllPrinters } from './PrinterService';

const PrinterSlice = createSlice({
    name : 'printers',
    initialState : {
        entities : [],
        loading : false,
        selectedPrinter : [],
        error : ''
    },
    reducers : {},
    extraReducers : (builder)=>{
        builder.addCase(getAllPrinters.pending,state=>{
            state.loading = true;
        })
        .addCase(getAllPrinters.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(getAllPrinters.rejected,(state,{payload})=>{
            state.loading = false;
            state.error = payload;
        })
    }
});

export default PrinterSlice.reducer;