import { createSlice } from '@reduxjs/toolkit';
import { generateReport } from './ReportServices';

const ReportSlice = createSlice({
    name : 'report',
    initialState : {
        loading : true,
        error : '',
        doc : '',
        uri : '',
        model : ''
    },
    reducers : {
        setModel : (state,{payload})=>{
            state.model = payload;
        },
        clearModel : state=>{
            state.model = '';
        },
        setUri : (state,{payload})=>{
            state.uri = payload;
        },
        clearUri : state=>{
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

export const { setUri,clearUri, setModel,clearModel } = ReportSlice.actions;
export default ReportSlice.reducer;