import Vue from 'vue';
import VueRouter from "vue-router";
import Login from "./components/login.vue";
import Home from "./components/home.vue";


Vue.use(VueRouter);

const Foo = {
    template: '<div>foo</div>'
}
const Bar = {
    template: '<div>bar</div>'
}



const routes = [{
        path: '/',
        component: Home
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/bar',
        component: Bar
    }
]


const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
});

export default router;