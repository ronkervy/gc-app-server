import { createSlice } from '@reduxjs/toolkit';
import { generateReport } from './ReportServices';

const ReportSlice = createSlice({
    name : 'report',
    initialState : {
        loading : true,
        error : '',
        doc : '',
        uri : ''
    },
    reducers : {
        setDate : (state,{payload})=>{
            state.uri = payload;
        },
        clearDate : state=>{
            state.uri = ""
        }
    },
    extraReducers : builder=>{
        builder.addCase( generateReport.pending, state=>{
            state.loading = true;
        })
        .addCase(generateReport.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.doc = payload;
        })
        .addCase( generateReport.rejected,(state,{payload})=>{
            state.loading = false;
            state.error = payload;
        })
    }
});

export const { setDate,clearDate } = ReportSlice.actions;
export default ReportSlice.reducer;