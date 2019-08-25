import * as React from 'react';
import classNames from 'classnames';
import * as ReactDOM from 'react-dom';
import './index.css';

export interface TooltipProps {
    className: string;
    value: string | JSX.Element;
}

export default class Tooltip extends React.Component<TooltipProps, {}> {

    static defaultProps = {
        className: '',
        value: 'tooltip',
    };

    render() {
        const { className, value } = this.props;
        return (
            <div className={classNames(className, 'common-tooltip')}>
                {value}
            </div>
        );
    }
}

class TooltipApi {

    tooltipDom: HTMLElement = null;
    private timeout: number;
    static instance: TooltipApi = null;

    static getInstance() {
        if (!this.instance) {
            this.instance = new TooltipApi();
        }
        return this.instance;
    };

    create = (cls?: string, value?: string | JSX.Element) => {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        if (!this.tooltipDom) {
            const div = document.createElement('div');
            div.id = 'tooltip';
            this.tooltipDom = div;
            document.body.appendChild(div);
        }
        ReactDOM.render(
            <Tooltip className={cls} value={value} />,
            document.getElementById('tooltip')
        );
        this.timeout = window.setTimeout(() => {
            this.destory();
        }, 3000);
    };

    destory = () => {
        const tooltip = document.getElementById('tooltip');
        ReactDOM.unmountComponentAtNode(tooltip);
        tooltip && document.body.removeChild(tooltip);
        this.tooltipDom = null;
    };
}

export const tooltipApi = TooltipApi.getInstance();

