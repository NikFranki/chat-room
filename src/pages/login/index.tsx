import * as React from 'react';
import Input from 'Components/input';
import Button from 'Components/button';
import Modal from 'Components/modal';
import { tooltipApi } from 'Components/tooltip';
import { RouteComponentProps, Route } from 'react-router-dom';
import * as io from 'socket.io-client';
import { ChatState } from 'Store/chat/types';
import { login } from 'Store/chat/actions';

import './index.css';

const socket = io('http://localhost:3000');

interface LoginProps extends RouteComponentProps<{}>, React.Props<{}>{
    login: typeof login;
    chat: ChatState;
    routes?: any;
}

export interface LoginState {
    visible: boolean;
    username: string;
}

export default class Login extends React.Component<LoginProps, LoginState> {

    private loginInput = React.createRef<Input>();

    state = {
        username: '',
        visible: true,
    };

    // 生成用户id
    generateUid = () => {
        return new Date().getTime() + '' + Math.floor(Math.random()*9+1);
    };

    handleLoginInput = (value: string) => {
        this.setState({ username: value });
    };

    handleLoginEnter = () => {
        this.handleLoginSubmit();
    };

    /**
     * 用户名校验 若校验成功则返回空字符串，验证失败，返回出错信息
     * username 用户名
     *
     * @memberof Chatroom
     */
    validateUsername = (username: string) => {
        const { onlineUsers } = this.props.chat;
        const rules = {
            isEmpty(name) {
                return name.length === 0 && '用户名的长度不能为空！';
            },
            isNotValidPrefix(name) {
                return (
                    !/^[\w|\_]/g.test(name) &&
                    '用户名的首字必须是字母、数字或者下划线！'
                );
            },
            isNotValidLength(name) {
                return !/^\w{2,6}$/g.test(name) && '用户名的长度必须在2-6位！';
            },
            isExisted(name) {
                let res = '';
                for (let key in onlineUsers) {
                    if (onlineUsers[key] === name) {
                        res = '该用户名已被占用，请换用其他名字！';
                        break;
                    }
                }
                return res;
            }
        };

        for (let rule in rules) {
            const res = rules[rule].call(this, username);
            if (res) {
                return res;
            }
        }

        return '';
    };

    handleLoginSubmit = () => {
        const { login, history } = this.props;
        let { username } = this.state;
        const res = this.validateUsername(username);
        if (res) {
            tooltipApi.create('login-error-tooltip', res);
            return;
        }

        const uid = this.generateUid();
        // 随机生成游客名字(暂时不支持游客)
        // username = username ? username : `游客${uid}`;

        // 生成用户名字
        this.setState({ visible: false });
        tooltipApi.create('chatroom-tooltip', `欢迎${username}进入聊天室!`);
        socket.emit('login', {uid, username});
        login({ uid, username });
        history.replace('/');
    };

    handleCloseModal = () => {
        this.handleLoginSubmit();
    };

    modal = () => {
        const { visible, username } = this.state;
        return (
            <Modal
                visible={visible}
                className="chatroom-modal"
                title="聊天室登录"
                onHandleClose={this.handleCloseModal}
                content={
                    <div className="login-row">
                        <label
                            className="login-label"
                            htmlFor="login-name"
                        >
                            请输入你的昵称：
                        </label>
                        <Input
                            ref={this.loginInput}
                            className="login-input"
                            value={username}
                            id="login-name"
                            onHandleInput={this.handleLoginInput}
                            onHandleEnter={this.handleLoginEnter}
                        />
                    </div>
                }
                footer={
                    <div>
                        <Button
                            className="login-btn"
                            value="登录"
                            onHandleClick={this.handleLoginSubmit}
                        />
                    </div>
                }
            />
        );
    };

    render() {
        return (
            <div className="chat-room-login">
                {this.modal()}
                {this.props.routes.map((route, i) => (
                    <Route
                        key={i}
                        path={route.path}
                        exact={route.exact}
                        render={props => (
                            <route.component
                                {...props}
                                routes={route.routes}
                            />
                        )}
                    />
                ))}
            </div>
        );
    }
}
