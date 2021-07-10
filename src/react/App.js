import { CssBaseline, Grid } from "@material-ui/core";
import AddEditProd from "./products/components/AddEdit/AddEditProd";
import { Switch, Route, useHistory } from 'react-router-dom';
import './styles.css';
import Nav from "./shared/Nav";
import SearchHeader from "./shared/SearchHeader";
import Home from "./components/Home";
import MainBar from "./shared/MainBar";
import ListDeliveries from "./deliveries/components/ListDeliveries";
import ListProd from "./products/components/Product List/ListProd";
import React,{ useEffect, useRef } from "react";
import { io } from 'socket.io-client';
import SearchResDialog from "./shared/SearchResDialog";
import SuppliersList from "./suppliers/components/SuppliersList";
import SingleSupp from "./suppliers/components/SingleSupp";
import AddSupplier from "./suppliers/components/AddSupplier";
import AddDeliveries from "./deliveries/components/AddDeliveries";
import DeliveryDeleteModal from "./deliveries/components/DeliveryDeleteModal";
import ProdDeleteModal from "./products/components/ProdDeleteModal";
import SingleProduct from "./products/components/Single Product/SingleProduct";
import Toast from "./shared/Toast";
import { useDispatch } from "react-redux";
import { CloseNotification } from "./shared/store/NotificationSlice";
import InvoicePreview from './deliveries/components/InvoicePreview';
import Reports from "./reports/components/Reports";

function App(props) {

  const searchRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory();

  const focusSearch = ()=>{
      searchRef.current.focus();
  }

  const handleCloseToast = ()=>{
      dispatch( CloseNotification() );
  }
  
  useEffect(()=>{
      const socket = io("http://localhost:8081");

      socket.emit('client',{
          hostName : "GC-SERVER",          
      });
      
      document.addEventListener('keydown',(e)=>{
          if( (e.ctrlKey && e.key === 'Enter') || (e.ctrlKey && e.key === 'f') ){
              focusSearch();
          }
      });

      history.push('/');

      return ()=>{
        document.removeEventListener('keydown',(e)=>{          
            if( e.ctrlKey && e.key === 'Enter'  ){
                focusSearch();
            }
        });
      };      
  
  },[]);

  return (
      <Grid className="App">   
          <MainBar />  
          <Nav />
          <Grid container className="content">
            <Grid disabled item sm={12} lg={12} style={{height: "50px"}}>
              <SearchHeader searchRef={searchRef} />
            </Grid>   
            <Grid item sm={12} lg={12}>
              <Switch>
                  <Route exact path="/">
                      <Home />
                  </Route>
                  <Route exact path="/products">
                        <ListProd />
                  </Route>
                  <Route exact path="/products/:id" >
                        <SingleProduct />
                  </Route>
                  <Route exact path="/products/add/new">
                        <AddEditProd />
                  </Route>
                  <Route exact path="/products/search/:search" >
                        <SearchResDialog />
                  </Route>
                  <Route exact path="/reports" >
                        <Reports />
                  </Route>
                  <Route exact path="/products/del/:id" >
                        <ProdDeleteModal />
                  </Route>
                  <Route exact path="/deliveries/add">
                        <AddDeliveries />
                  </Route>
                  <Route exact path="/suppliers" >
                        <SuppliersList />
                  </Route>
                  <Route exact path="/suppliers/add">
                        <AddSupplier />
                  </Route>
                  <Route exact path="/deliveries">
                        <ListDeliveries />
                  </Route>                  
                  <Route exact path="/deliveries/del/:id">
                        <DeliveryDeleteModal />
                  </Route>
                  <Route exact path="/suppliers/:id">
                        <SingleSupp />
                  </Route>
                  <Route exact path="/deliveries/invoice" >
                      <InvoicePreview />
                  </Route>
              </Switch>    
              <Toast 
                  handleCloseToast={handleCloseToast}
              />        
            </Grid>                     
          </Grid>  
          <CssBaseline />                            
      </Grid>      
  );
}

export default App;
