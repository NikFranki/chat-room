import * as React from 'react';
import classNames from 'classnames';
import './index.css';

export interface ModalProps {
    visible: boolean;
    className: string;
    title: string | JSX.Element;
    content: string | JSX.Element;
    footer: string | JSX.Element;
    closeable: boolean;
    onHandleClose?: Function;
}

let updateState: boolean = false;
export default class Modal extends React.Component<ModalProps, {}> {

    static defaultProps = {
        visible: false,
        className: '',
        title: 'modal tilte',
        content: 'modal content',
        footer: 'modal footer',
        closeable: true,
    };

    state = {
        visible: false || this.props.visible
    };

    static getDerivedStateFromProps(props: ModalProps, state) {
        if (props.visible !== state.visible && !updateState) {
            return {
                visible: props.visible
            };
        } else {
            updateState = false;
            return {
                visible: state.visible
            };
        }
        return null;
    }

    handleClose = () => {
        updateState = true;
        this.setState({ visible: false });
        this.props.onHandleClose && this.props.onHandleClose();
    };

    render() {
        const {
            className,
            title,
            content,
            footer,
            closeable
        } = this.props;
        const { visible } = this.state;
        return visible && (
            <div className={classNames(className, 'common-modal')}>
                <div className="modal-background" />
                <div className="modal-wrapper">
                    <div className="modal-header">
                        {title}
                        {closeable && (
                            <img
                                onClick={this.handleClose}
                                className="close-btn"
                                alt="close"
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABAUlEQVRIS+2UwW3DMAxFKXKBbFILHiDJBu0m7STtJu0GSQYwlG7SBUgXSmxAECSROvhmH23qP/L7iw42ftzG+rADVIeLFoUQBmb+JKI37/1fSyWEcGDmbyL68N7f89oiYJqmKwAc53m+E9G5BlnEL865AQBu4zieTIB4UEQi5KUGycR/EfFUaqSaohbEKh6naca0BImHmHm1pdr5apV6D3LIo6un56q4OsHaRQpZ3pnEuwCJLaClK02SyaLU8+VwNV2mmKbW5D80ftMibJqgFUXLPWmmyJJzK6S5KrQoZunqWhWDiHwh4qtl2YnIDyK+m5eduoM7CtSYdmgVS3eA6uA/gPHkGSiuD9gAAAAASUVORK5CYII="
                            />
                        )}
                    </div>
                    <div className="modal-content">{content}</div>
                    <div className="modal-footer">{footer}</div>
                </div>
            </div>
        );
    }
}