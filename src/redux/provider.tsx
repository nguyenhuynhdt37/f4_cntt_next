'use client';

import React from 'react';
import { Provider } from 'react-redux';
// Loại bỏ import PersistGate
// import { PersistGate } from 'redux-persist/integration/react';
import { store } from './store'; // Loại bỏ persistor

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}
