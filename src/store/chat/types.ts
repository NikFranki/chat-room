// src/store/chat/types.ts
export interface UserType {
    uid: string;
    username: string;
}

export interface Message {
    uid: string;
    username: string;
    action: string;
    msgId: string;
    time: string;
    type: string;
}

export interface ChatState {
    username: string;
    uid: string;
    socket: any;
    messages: Message[];
    onlineUsers: UserType;
    onlineCount: number;
}

export const LOGIN = 'LOGIN';
export const UPDATE_MESSAGE = 'UPDATE_MESSAGE';

export interface LoginAction {
    type: typeof LOGIN;
    payload: UserType;
}

export interface UpdateMessageAction {
    type: typeof UPDATE_MESSAGE;
    payload: ChatState;
}

export type ChatActionTypes = LoginAction | UpdateMessageAction