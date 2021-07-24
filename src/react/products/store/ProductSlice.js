import { createSlice } from '@reduxjs/toolkit';
import {
    getProducts,
    getProduct,
    findProduct,
    createProduct,
    updateProduct,
    deleteProduct  
} from './ProdServices';

const ProductSlice = createSlice({
    name : 'products',
    initialState : {
        entities : [],
        loading : true,
        selectedProd : [],
        error : null
    },
    reducers : {},
    extraReducers : (builder)=>{
        //FETCH ALL PRODUCTS
        builder.addCase(getProducts.pending, (state)=>{
            state.loading = true;
        })
        .addCase(getProducts.fulfilled, (state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(getProducts.rejected, (state,{payload})=>{
            state.loading = false;
            state.error = payload;
        })
        //FETCH SINGLE PRODUCT
        .addCase(getProduct.pending,state=>{
            state.loading = true;
        })
        .addCase(getProduct.fulfilled,(state,{payload})=>{            
            state.loading = false;
            state.selectedProd = payload;    
        })
        .addCase(getProduct.rejected,(state,{payload})=>{
            state.loading = false;
            state.error = payload;
        })
        //FIND SPECIFIC PRODUCT
        .addCase(findProduct.pending, state=>{
            state.loading = true;
        })
        .addCase(findProduct.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(findProduct.rejected,(state,{payload})=>{
            state.loading = false;
            state.error = payload;
        })
        //CREATE PRODUCTS
        .addCase(createProduct.pending,(state)=>{
            state.loading = true;
        })
        .addCase(createProduct.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(createProduct.rejected,( state,{payload} )=>{
            state.loading = false;
            state.error = payload;
        })
        //UPDATE PRODUCTS
        .addCase(updateProduct.pending,state=>{
            state.loading = true;
        })
        .addCase(updateProduct.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.selectedProd = payload;          
        })
        .addCase(updateProduct.rejected,(state,{payload})=>{
            state.loading = false;
            state.error = payload;
        })
        //DELETE PRODUCTS
        .addCase(deleteProduct.pending, state=>{
            state.loading = true;
        })
        .addCase(deleteProduct.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities[payload.item_id] = payload;
        })
        .addCase(deleteProduct.rejected,(state,{payload})=>{
            state.loading = false;
            state.error = payload;
        });
    }
});

export default ProductSlice.reducer;