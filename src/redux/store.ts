import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import slices
import authReducer from './slices/authSlice';
import bookReducer from './slices/bookSlice';
import borrowReducer from './slices/borrowSlice';
import libraryUsersReducer from './slices/libraryUsersSlice';
import transactionReducer from './slices/transactionSlice';

// Configure Redux Persist
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'], // only persist auth state
};

const rootReducer = combineReducers({
    auth: authReducer,
    books: bookReducer,
    borrow: borrowReducer,
    libraryUsers: libraryUsersReducer,
    transactions: transactionReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'], // ignore redux-persist actions
            },
        }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
