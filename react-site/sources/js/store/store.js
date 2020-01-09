import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers/rootReducer';

// combine all states
const initState = {};

// set middleware
const middleware = [];

const store = createStore(
    rootReducer,
    initState,
    applyMiddleware(...middleware)
);

export default store;