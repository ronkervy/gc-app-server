const router = require('express').Router();

const {
    productList,  
    productSingle, 
    productCreate,
    productUpdate,
    productDelete,
    productSearch,
    transactionList,
    transactionSingle,
    transactionSearch,
    transactionCreate,
    transactionUpdate,
    transactionDelete,
    serverInfo,
    supplierProducts,
    supplierList,
    supplierSingle,
    supplierCreate,
    supplierUpdate,
    supplierDelete,
    deliveryList,
    deliverySingle,
    deliverySearch,
    deliveryCreate,
    deliveryUpdate,
    deliveryDelete    
} = require('../controllers/api.controller');

const {
    generatePdf,
    transactionDoc
} = require('../controllers/printer.controller');

//PRODUCTS ROUTES
router.get('/products',productList);
router.get('/products/:id',productSingle);
router.get('/products/search/:search',productSearch);
router.post('/products',productCreate);
router.patch('/products/:id',productUpdate);
router.delete('/products/:id',productDelete);

//TRANSACTION ROUTES
router.get('/transactions',transactionList);
router.get('/transactions/:id',transactionSingle);
router.get('/search/transactions',transactionSearch);
router.post('/transactions',transactionCreate);
router.patch('/transactions/:id',transactionUpdate);
router.delete('/transactions/:id',transactionDelete);

//SUPPLIERS ROUTE
router.get('/suppliers',supplierList);
router.get('/suppliers/:id',supplierSingle);
router.get('/suppliers/prods/:id',supplierProducts);
router.post('/suppliers',supplierCreate);
router.patch('/suppliers/:id',supplierUpdate);
router.delete('/suppliers/:id',supplierDelete);

//DELIVERIES ROUTE
router.get('/deliveries',deliveryList);
router.get('/deliveries/:id',deliverySingle);
router.get('/deliveries/search/:search',deliverySearch);
router.post('/deliveries',deliveryCreate);
router.patch('/deliveries/:id',deliveryUpdate);
router.delete('/deliveries/:id',deliveryDelete);

//PDF PRINT DELIVERIES ROUTE
router.get('/gc-print/deliveries/:id',generatePdf);
router.get('/gc-print/transactions/:id',transactionDoc);

//OS INFO
router.get('/server_info',serverInfo);

module.exports = router;