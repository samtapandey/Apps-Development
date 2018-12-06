import { combineReducers } from 'redux';
import dataElementReducer from './dataElementReducer';

export default combineReducers({
    DataElement:dataElementReducer
    })