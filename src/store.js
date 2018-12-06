import {createStore, applyMiddleware,compose} from "redux";
import rootReducer from '../src/components/reducers/';
import thunk from "redux-thunk"

const initialState = {};

const middleware = [thunk];

const store =  createStore(
     rootReducer,
     initialState,
     applyMiddleware(...middleware),
     );

  
  export default store;