// src/store/index.ts
import { combineReducers } from 'redux';

import { chatReducer } from './chat/reducers';

const rootReducer = combineReducers({
    chat: chatReducer
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>