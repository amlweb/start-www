import { combineReducers } from 'redux';
import example from './exampleReducer';

// combine reducers
const rootReducer = combineReducers({
    example
});

export default rootReducer;
