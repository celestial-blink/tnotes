import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import "./styles/index.css";
import Routes from './routes';
import Provider from './Provider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider>
            <RouterProvider router={Routes} />
        </Provider>
    </React.StrictMode>,
)
