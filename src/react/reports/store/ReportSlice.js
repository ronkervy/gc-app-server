import { createSlice } from '@reduxjs/toolkit';
import { generateReport } from './ReportServices';

const ReportSlice = createSlice({
    name : 'report',
    initialState : {
        entities : [],
        loading : true,
        error : ''
    },
    reducers : {},
    extraReducers : builder=>{
        builder.addCase( generateReport.pending, state=>{
            state.loading = true;
        })
        .addCase(generateReport.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase( generateReport.rejected,(state,{payload})=>{
            state.loading = false;
            state.error = payload;
        })
    }
});

export default ReportSlice.reducer;