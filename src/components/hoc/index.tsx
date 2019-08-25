import * as React from 'react';

export interface withComponentProps {
    [propName: string]: any // 任意类型
}

const withComponent = (data: Partial<withComponentProps>) => {
    return <P extends {}>(
        WrapperComponent: React.ComponentType<P>
    ): React.ComponentClass<any> =>
        class extends React.Component<P> {
            constructor(props: any) {
                super(props);
            }

            render() {
                return (
                    <WrapperComponent
                        {...data}
                        {...this.props}
                    />
                );
            }
        };
};

export default withComponent;





