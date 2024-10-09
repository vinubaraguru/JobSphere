import './App.css';
import React, { Provider } from 'react-redux';
import store from './store/store';
import ErrorBoundary from './components/ErrorBoundary';
import Routers from './components/AppRouters';
import AppNavBar from './components/AppNavbar';

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AppNavBar />
        <Routers />
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
