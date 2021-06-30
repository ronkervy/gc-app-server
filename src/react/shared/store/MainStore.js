import { configureStore,getDefaultMiddleware } from '@reduxjs/toolkit';
import ProductReducer from '../../products/store/ProductSlice';
import SupplierReducer from '../../suppliers/store/SupplierSlice';
import DeliveriesReducer from '../../deliveries/store/DeliveriesSlice';
import NotificationReducer from './NotificationSlice';
import InvoiceReducer from './InvoiceSlice';
import PrinterReducer from './PrinterSlice';

export default configureStore({
    reducer : {
        products : ProductReducer,
        suppliers : SupplierReducer,
        deliveries : DeliveriesReducer,
        notifications : NotificationReducer,
        invoice : InvoiceReducer,
        printers : PrinterReducer
    },    
    middleware : getDefaultMiddleware({
        serializableCheck : false
    })
});