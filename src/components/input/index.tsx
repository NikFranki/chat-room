import * as React from 'react';
import classNames from 'classnames';
import './index.css';

export interface InputProps {
    className?: string;
    onHandleInput?: Function;
    onHandleEnter?: Function;
    id?: string;
    value: string;
}

export interface InputState {
    value: string;
}

let updateState: boolean = false;
export default class Input extends React.Component<InputProps, InputState> {

    static defaultProps = {
        className: '',
        id: '',
        value: ''
    };

    state = {
        value: this.props.value || ''
    };

     static getDerivedStateFromProps(props: InputProps, state) {
        if (props.value !== state.value && !updateState) {
            return {
                value: props.value
            };
        } else {
            updateState = false;
            return {
                value: state.value
            };
        }
        return null;
    }

    handleInput = (e: any) => {
        const { onHandleInput } = this.props;
        const value = e.target.value;
        this.setState({ value });
        updateState = true;
        onHandleInput && onHandleInput(value);
    };

    handleEnter = (e: any) => {
        const { onHandleEnter } = this.props;
        if (e.key === 'Enter') {
            console.log('enter');
            onHandleEnter && onHandleEnter();
        }
        return false;
    };

    render() {
        const { className, id } = this.props;
        const { value } = this.state;
        return (
            <input
                id={id}
                onChange={this.handleInput}
                onKeyPress={this.handleEnter}
                className={classNames(className, 'input-value-area')}
                type="text"
                value={value}
            />
        );
    }
}
