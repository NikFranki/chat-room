import * as React from 'react';
import Input from 'Components/input';
import Button from 'Components/button';
import { tooltipApi } from 'Components/tooltip';
import { RouteComponentProps } from 'react-router-dom';
import * as io from 'socket.io-client';
import classNames from 'classnames';
import './index.css';

const socket = io('http://localhost:3000');

import { ChatState, Message } from 'Store/chat/types';
import { updateMessage } from 'Store/chat/actions';

import { getImageBase64 } from 'Util/index';
const imgUpload = require('Resource/images/img-upload.png');
const faceUpload = require('Resource/images/face.png');

interface ChatroomProps extends RouteComponentProps<{}>, React.Props<{}> {
    chat: ChatState;
    updateMessage: typeof updateMessage;
}

export interface ChatroomState {
    text: string;
    userhtml: string;
    showFace: boolean;
}

export default class Chatroom extends React.Component<ChatroomProps, ChatroomState> {

    private face = React.createRef<HTMLDivElement>();
    constrolFacePannel: () => void;

    state = {
        text: '',
        userhtml: '',
        showFace: false,
    };

    constructor(props) {
        super(props);
        this.init();
    }

    UNSAFE_componentWillMount() {
        socket.emit('onlineUsers');
    }

    // 生成'hh-mm'格式的时间
    generateTime() {
        let hour: number | string = new Date().getHours(),
            minute: number | string = new Date().getMinutes();
        hour = (hour === 0) ? '00' : hour;
        minute = (minute < 10) ? '0' + minute : minute;
        return hour + ':' + minute;
    }

    // 生成消息id
    generateMsgId() {
        return new Date().getTime()+""+Math.floor(Math.random()*899+100);
    }

    // 处理在线人数及用户名，即聊天室状态栏
    handleUsers() {
        const users = this.props.chat.onlineUsers;
        let userhtml = '';
        let separator = '';
        for (let key in users) {
            if (users.hasOwnProperty(key)) {
                userhtml += separator + users[key];
                separator = '、';
            }
        }
        this.setState({ userhtml });
    };

    // 更新系统消息
    updateSysMsg = (o: {user: {uid: string, username: string}, onlineUsers: {[propName: string]: string}, onlineCount: number, error?: string}, action: string) => {
        const { updateMessage, chat } = this.props;
        let { messages } = chat;
        const newMsg: Message = {
            type: 'system',
            username: o.user.username,
            uid: o.user.uid,
            action: action,
            msgId: this.generateMsgId(),
            time: this.generateTime()
        };
        messages.push(newMsg);
        updateMessage({
            onlineCount: o.onlineCount,
            onlineUsers: o.onlineUsers,
            messages,
            ...(action === 'logout' ? { id: '', username: '' } : {})
        });
        this.handleUsers();
    };

    // 更新用户消息
    updateUserMsg = (o: {username: string, uid: string, message: string}) => {
        const { updateMessage, chat } = this.props;
        let { messages } = chat;
        const newMsg: Message = {
            type: 'chat',
            username: o.username,
            uid: o.uid,
            action: o.message,
            msgId: this.generateMsgId(),
            time: this.generateTime()
        };
        messages.push(newMsg);
        updateMessage({
            messages
        });
    };
    
    // 初始化，开始监控socket
    init = () => {
        // 客户端监控登录
        socket.on('login', obj => {
            this.updateSysMsg(obj, 'login');
        });
        // 客户端监控退出
        socket.on('logout', obj => {
            this.updateSysMsg(obj, 'logout');
        });
        // 客户端监控消息传送
        socket.on('message', obj => {
            this.updateUserMsg(obj);
        });
        // 客户端监控在线人物
        socket.on('onlineUsers', (obj) => {
            const { updateMessage } = this.props;
            updateMessage({ onlineUsers: obj });
        });
    };

    componentDidMount() {
        const { uid } = this.props.chat;
        !uid && this.props.history.replace('/login');
        // 点击空白隐藏表情面板
        this.constrolFacePannel = () => {
            this.setState({ showFace: false });
        };
        document.body.addEventListener('click', this.constrolFacePannel);
    }

    componentWillUnmount() {
        socket.removeEventListener('login');
        socket.removeEventListener('logout');
        socket.removeEventListener('message');
        socket.removeEventListener('onlineUsers');
        document.body.removeEventListener('click', this.constrolFacePannel);
    }

    handleLoginOrLogout = () => {
        const { chat, history } = this.props;
        const { username, uid } = chat;
        console.log(username);
        if (username) {
            socket.emit('logout', { uid, username });
        } else {
            history.push('/login');
        }
    };

    header = () => {
        const { username, onlineCount } = this.props.chat;
        const { userhtml } = this.state;
        return (
            <div className="classroom-header-detail">
                <span className="header-online-user">当前用户 {username}</span>
                <span className="header-title-label">
                    FRANKI chat room
                </span>
                <span className="header-hotes-label">
                    在线人数 {onlineCount}
                </span>
                <span onClick={this.handleLoginOrLogout} className='header-login-btn'>{`${username ? 'logout' : 'login'}`}</span>
                <div className='header-online-userlist'>在线列表 {userhtml}</div>
            </div>
        );
    };

    content = () => {
        const { messages, uid } = this.props.chat;
        return (
            <div className="chatroom-content">
                {messages.length > 0 &&
                    messages.map((item, index) => {
                        const isImg = item.action.indexOf('base64') > -1;
                        return item.type !== 'system' && (
                            <div key={index} className={classNames("chatroom-content-item", `${uid === item.uid ? 'me' : 'other'}`)}>
                                <div className='chatroom-content-item-username-time'>{item.username} {item.time}</div>
                                <div className={classNames('chatroom-content-item-message', `${isImg ? 'image' : ''}`)}>{item.action.indexOf('base64') > -1 
                                    ? 
                                        <img width='auto' src={item.action} alt='img' />
                                    :
                                        item.action
                                }</div>
                            </div>
                        );
                    })}
            </div>
        );
    };

    handleFooterInput = (value: string) => {
        console.log(value);
        this.setState({ text: value });
    };

    handleInputEnter = () => {
        this.handleFooterSubmit();
    };

    handleFooterSubmit = () => {
        const { chat } = this.props;
        const { text } = this.state;
        const { uid, username } = chat;
        if (!username) {
            tooltipApi.create('login-error-tooltip', '你还没有登录');
            this.setState({ text: '' });
            return
        };
        socket.emit('message', { uid, username, message: text });
        this.setState({ text: '' });
    };

    handleFileChange = (e: any) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.setState({ text: e.target.result }, () => {
                this.handleFooterSubmit();
            });
        };
        reader.readAsDataURL(file);
    }

    handleFaceBtnClick = () => {
        this.setState({ showFace: !this.state.showFace });
    };

    footer = () => {
        const { text, showFace } = this.state;
        
        return (
            <div className='chatroom-footer'>
                <div className='operator-area'>
                    <div className='local-img-uploader'>
                        <label htmlFor="profile_pic"><img width="32" src={imgUpload} alt="img"/></label>
                        <input onChange={this.handleFileChange} type="file" name="profile_pic" id='profile_pic' accept=".jpg, .jpeg, .png, .gif" />
                    </div>
                    <div className='face-img-send'>
                        <img onClick={this.handleFaceBtnClick} width="32" src={faceUpload} alt="face" />
                        <div className={classNames('face-wrapper', `${showFace ? '' : 'hide'}`)} ref={this.face}>
                            {
                                ...((() => {
                                    const arr = [];
                                    for (let i=1; i<123; i++) {
                                        const img = <img 
                                            key={i}
                                            data-num={i.toString()}
                                            src={require(`Resource/images/face/${i}.png`)}
                                            alt='img'
                                            onClick={(e) => {
                                                this.setState({ showFace: false, text: getImageBase64(e.target, 'png') }, () => {
                                                    this.handleFooterSubmit();
                                                });
                                            }}
                                        />;
                                        arr.push(img);
                                    }
                                    return arr; 
                                })())
                            }
                        </div>
                    </div>
                </div>
                <div className="submit-footer">
                    <Input
                        className="classroom-footer-input"
                        value={text}
                        onHandleInput={this.handleFooterInput}
                        onHandleEnter={this.handleInputEnter}
                    />
                    <Button
                        className="classroom-footer-btn"
                        onHandleClick={this.handleFooterSubmit}
                    />
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className="chatroom-wrapper">
                {this.header()}
                {this.content()}
                {this.footer()}
            </div>
        );
    }
}
