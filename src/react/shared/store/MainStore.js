import { configureStore,getDefaultMiddleware } from '@reduxjs/toolkit';
import ProductReducer from '../../products/store/ProductSlice';
import SupplierReducer from '../../suppliers/store/SupplierSlice';
import DeliveriesReducer from '../../deliveries/store/DeliveriesSlice';
import NotificationReducer from './NotificationSlice';
import InvoiceReducer from './InvoiceSlice';
import PrinterReducer from './PrinterSlice';
import TransactionReducer from '../../transactions/store/TransactionSlice';
import ReportReducer from '../../reports/store/ReportSlice';

export default configureStore({
    reducer : {
        products : ProductReducer,
        suppliers : SupplierReducer,
        deliveries : DeliveriesReducer,
        notifications : NotificationReducer,
        invoice : InvoiceReducer,
        printers : PrinterReducer,
        transactions : TransactionReducer,
        report : ReportReducer
    },    
    middleware : getDefaultMiddleware({
        serializableCheck : false
    })
});