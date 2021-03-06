import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';

import App from './App';
import { Provider } from 'react-redux';
import store from './shared/store/MainStore';  

ReactDOM.render(
  <Provider store={store}>
    <Router>      
        <App />      
    </Router>
  </Provider>,
  document.getElementById('root')
);
