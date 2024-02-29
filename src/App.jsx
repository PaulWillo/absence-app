import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import { fetchAbsences } from './reducers/absences/slice';
import { ConfigProvider, LanguageProvider } from './components/Context';
import config from './config/development.json';
import language from './config/language.json';
import AbsenceTable from './components/AbsenceTable';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAbsences());
  }, [dispatch]);

  return (
    <ConfigProvider value={config}>
    <LanguageProvider value={language}>
    <AbsenceTable/>
    </LanguageProvider>
    </ConfigProvider>
  );
}

export default App;
