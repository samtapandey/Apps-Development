
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { MemoryRouter } from 'react-router-dom'
import {Provider} from 'react-redux'
import store from './store'

import './index.css';

ReactDOM.render(
 <Provider store={store}><MemoryRouter><App/></MemoryRouter></Provider>,
  document.getElementById('root'));
   