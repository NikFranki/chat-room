import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import routes from 'Routes/index';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './store';

const store = createStore(rootReducer);

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Switch>
                {routes.map((route, i) => (
                    <Route
                        key={i}
                        path={route.path}
                        exact={route.exact}
                        render={props => (
                            <route.component {...props} routes={route.routes} />
                        )}
                    />
                ))}
            </Switch>
        </Router>
    </Provider>,
    document.getElementById('root')
);

if (module.hot) {
   module.hot.accept();
}
