// src/store/chat/reducers.ts

import {
    ChatState,
    ChatActionTypes,
    LOGIN,
    UPDATE_MESSAGE,
} from './types'

const initialState: ChatState = {
    username: '',
    uid: '',
    socket: null,
    messages: [],
    onlineUsers: {uid: '', username: ''},
    onlineCount: 0
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