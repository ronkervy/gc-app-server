import { createSlice } from '@reduxjs/toolkit';
import { 
    CreateDelivery, 
    DeleteDelivery, 
    GetAllDeliveries, 
    GetSingleDelivery, 
    UpdateDeliveryStatus 
} from './DelServices';

export const DeliveriesSlice = createSlice({
    name : 'deliveries',
    initialState : {
        entities : [],
        cart : [],
        loading : true,
        error : ''
    },
    reducers : {
        AddToCart : (state,{payload})=>{
            
            const index = state.cart.findIndex(product=>product._id === payload._id);

            const {
                _id,
                item_name,
                item_price,
                item_qty,
                item_supplier
            } = payload;
            
            const qty = 1;
            const discount = 0;

            if( index === -1 ){
                state.cart.push({
                    _id,
                    item_name,
                    qty,
                    price : item_price,
                    item_discount : discount,
                    inventory_qty : item_qty,
                    supplier : item_supplier
                });
            }else{
                state.cart[index].qty = parseInt(state.cart[index].qty) + 1;
            }
        },
        RemoveFromCart : (state,{payload})=>{
            const index = state.cart.findIndex(product=>product._id === payload._id);
            state.cart.splice(index,1);
        },
        UpdateQty : (state,{payload})=>{
            const { product,qty } = payload;
            const index = state.cart.findIndex(prod=>prod._id === product._id);
            state.cart[index].qty = qty;
        },
        SetDiscount : (state,{payload})=>{
            const { product,item_discount } = payload;
            const index = state.cart.findIndex(prod=>prod._id === product._id);
            state.cart[index].item_discount = item_discount;
        },
        ClearCart : (state)=>{
            state.cart = [];
        }
    },
    extraReducers : (builder)=>{
        //GET ALL DELIVERY
        builder.addCase(GetAllDeliveries.pending,state=>{
            state.loading = true;
        })
        .addCase(GetAllDeliveries.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(GetAllDeliveries.rejected,(state,{payload})=>{
            state.loading = false;
            state.error = payload;
        })
        //GET SINGLE DELIVERY INFO
        .addCase(GetSingleDelivery.pending,state=>{
            state.loading = true;
        })
        .addCase(GetSingleDelivery.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities[payload._id] = payload;
        })
        .addCase(GetSingleDelivery.rejected,(state,{payload})=>{
            state.loading = false;
            state.error = payload;
        })
        //CREATE DELIVERY ORDER
        .addCase(CreateDelivery.pending,state=>{
            state.loading = true;
        })
        .addCase(CreateDelivery.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities[payload._id] = payload;
        })
        .addCase(CreateDelivery.rejected,(state,{payload})=>{
            state.loading = false;
            state.error = payload;
        })
        //UPDATE STATUS AND INVENTORY QTY
        .addCase(UpdateDeliveryStatus.pending,state=>{
            state.loading = true;
        })
        .addCase(UpdateDeliveryStatus.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(UpdateDeliveryStatus.rejected,(state,{payload})=>{
            state.loading = false;
            state.error = payload;
        })
        //DELETE DELIVERY ENTRIES
        .addCase(DeleteDelivery.pending,state=>{
            state.loading = true;
        })
        .addCase(DeleteDelivery.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(DeleteDelivery.rejected,(state,{payload})=>{
            state.loading = false;
            state.error = payload;
        })
    }
});

export const { AddToCart, RemoveFromCart,UpdateQty,ClearCart,SetDiscount } = DeliveriesSlice.actions;
export default DeliveriesSlice.reducer;