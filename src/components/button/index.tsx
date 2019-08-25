import * as React from 'react';
import classNames from 'classnames';
import './index.css';

export interface ButtonProps {
    value: string;
    className: string;
    onHandleClick: Function;
}

export default class Button extends React.Component<ButtonProps, {}> {

    static defaultProps = {
        className: '',
        value: '发送',
    };

    handleClick = () => {
        if (this.props.onHandleClick) {
            this.props.onHandleClick();
        }
    };

    render() {
        const { value, className } = this.props;
        return (
            <button
                onClick={this.handleClick}
                className={classNames(className, "common-button")}
            >
                {value}
            </button>
        );
    }
}