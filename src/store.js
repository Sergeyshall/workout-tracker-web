import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import drawerMenu from './slices/drawerMenuSlice';
import workouts from './slices/workoutsSlice';
import musicPlayer from './slices/musicPlayerSlice';
import workoutProgress from './slices/workoutProgressSlice';

const rootReducer = combineReducers({
    drawerMenu,
    workouts,
    musicPlayer,
    workoutProgress,
});

const persistConfig = {
    key: 'workout-tracker',
    storage,
    whitelist: ['workoutProgress'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
export default store;
