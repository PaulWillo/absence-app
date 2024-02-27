import { thunk } from 'redux-thunk'
import { applyMiddleware, compose} from 'redux';
import { legacy_createStore as createStore} from 'redux'
import rootReducer from './reducers';
import { devToolsEnhancer } from '@redux-devtools/extension';

export default createStore(
    rootReducer,
    undefined,
    compose(applyMiddleware(thunk), devToolsEnhancer()),
);

