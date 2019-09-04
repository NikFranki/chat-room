// src/store/chat/reducers.ts
import * as io from 'socket.io-client';

import {
    ChatState,
    ChatActionTypes,
    LOGIN,
    UPDATE_MESSAGE,
} from './types'

const initialState: ChatState = {
    username: '',
    uid: '',
    messages: [],
    onlineUsers: {uid: '', username: ''},
    onlineCount: 0,
    socket: io('http://localhost:3000'),
}

export function chatReducer(
    state = initialState,
    action: ChatActionTypes
): ChatState {
    switch (action.type) {
        case LOGIN:
        case UPDATE_MESSAGE:
            return { ...state, ...action.payload }
        default:
            return state
    }
}