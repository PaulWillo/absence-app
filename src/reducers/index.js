import {combineReducers} from 'redux';
import absenceSlice from './absences/slice';


const rootReducer = combineReducers({
    //Absences
    absences: absenceSlice,
});

export default rootReducer;