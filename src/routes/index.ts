import Chatroom from 'Container/chatroom';
import Login from 'Container/login';

export default [
    {
        exact: true,
        path: '/',
        component: Chatroom
    },
    {
        path: '/login',
        component: Login,
        routes: [
            // {
            //     exact: true,
            //     path: '/login/bus',
            //     component: Bus
            // },
            // {
            //     exact: true,
            //     path: '/login/taxi',
            //     component: Taxi
            // }
        ]
    }
];
