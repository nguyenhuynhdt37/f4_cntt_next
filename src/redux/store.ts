import { configureStore, combineReducers } from '@reduxjs/toolkit';
// Loại bỏ import redux-persist
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';

// Import slices
import authReducer from './slices/authSlice';
import bookReducer from './slices/bookSlice';
import borrowReducer from './slices/borrowSlice';
import libraryUsersReducer from './slices/libraryUsersSlice';
import transactionReducer from './slices/transactionSlice';

// Loại bỏ cấu hình Redux Persist
// const persistConfig = {
//     key: 'root',
//     storage,
//     whitelist: [], // không lưu trữ bất kỳ state nào
// };

const rootReducer = combineReducers({
    auth: authReducer,
    books: bookReducer,
    borrow: borrowReducer,
    libraryUsers: libraryUsersReducer,
    transactions: transactionReducer,
});

// Loại bỏ persistReducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: rootReducer, // Sử dụng rootReducer trực tiếp thay vì persistedReducer
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // ignoredActions: ['persist/PERSIST'], // Không cần thiết nữa
            },
        }),
});

// Loại bỏ persistor
// export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
