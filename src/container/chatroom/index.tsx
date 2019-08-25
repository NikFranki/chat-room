import * as React from 'react';
import { connect } from 'react-redux';

import { AppState } from 'Store/index';

import { updateMessage } from 'Store/chat/actions';

import Chatroom from 'Pages/chatroom';

const mapStateToProps = (state: AppState) => ({
    chat: state.chat
});

const mapDispatchToProps = dispatch => ({
    updateMessage: message => dispatch(updateMessage(message))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Chatroom);
