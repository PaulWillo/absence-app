import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import { fetchAbsences } from './reducers/absences/slice';

const App = () => {
  const dispatch = useDispatch();
    
  useEffect(() => {
    dispatch(fetchAbsences());
  }, [dispatch]);

  return (
    <div className="App">
      <h1>Hello World</h1>
    </div>
  );
}

export default App;
