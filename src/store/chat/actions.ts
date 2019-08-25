// src/store/chat/actions.ts

import { LOGIN, UPDATE_MESSAGE, ChatActionTypes } from './types'

export function login(loginMsg): ChatActionTypes {
    return {
        type: LOGIN,
        payload: loginMsg
    }
}

export function updateMessage(messsage): ChatActionTypes {
    return {
        type: UPDATE_MESSAGE,
        payload: messsage,
    }
}