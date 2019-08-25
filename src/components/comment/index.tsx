import * as React from 'react';

export interface CommentProps {
    compiler: string;
    framework: string;
}

// 'CommentProps' describes the shape of props.
// State is never set so we use the '{}' type.
export default class Comment extends React.Component<CommentProps, {}> {
    render() {
        return (
            <h1>
                Comment from {this.props.compiler} and {this.props.framework}!
            </h1>
        );
    }
}
