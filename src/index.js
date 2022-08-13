import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux'
import store from './redux/store'
import LandingPage from './components/LandingPage';









const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <Provider store={store}>
        {/* <FormATron/> */}
        <LandingPage />
    </Provider>


)

