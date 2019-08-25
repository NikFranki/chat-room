import * as React from 'react';
import { connect } from 'react-redux';

import { AppState } from 'Store/index';

import { login } from 'Store/chat/actions';

import Login from 'Pages/login';

const mapStateToProps = ({ chat }: AppState) => ({
    chat
});

const mapDispatchToProps = dispatch => ({
    login: loginMsg => dispatch(login(loginMsg)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
