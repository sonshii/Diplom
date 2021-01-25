import VueRouter from 'vue-router';
import firebase from 'firebase/app'

const router = new VueRouter({
    routes: [
        {
            path: '/SignIn',
            name: 'Sign-In',
            component: () => import('../src/views/SignIn')
        },
        {
            path: '/SignUp',
            name: 'Sign-Up',
            component: () => import('../src/views/SignUp')
        },
        {
            path: '/',
            name: 'Home',
            component: () => import('../src/views/MainPage'),
            meta: {auth: true}
        },
        {
            path: '/MyAbstract',
            name: 'Abstracts',
            component: () => import('../src/views/MyAbstract'),
            meta: {auth: true}
        },
        {
            path: '/MyNotes',
            name: 'Notes',
            component: () => import('../src/views/MyNotes'),
            meta: {auth: true}
        },
        {
            path: '/MyGroup',
            name: 'Groups',
            component: () => import('../src/views/MyGroup'),
            meta: {auth: true}
        },
        {
            path: '/MyGroup/:id',
            name: 'Group',
            component: () => import('../src/views/MyGroupInfo'),
            meta: {auth: true},
            props: true
        },
        {
            path: '/MyGroup/:id/Notes',
            name: 'NotesGroup',
            component: () => import('../src/views/MyGroupNotes'),
            meta: {auth: true},
            props: true
        },
        {
            path: '/MyGroup/:id/Abstracts',
            name: 'AbstractsGroup',
            component: () => import('../src/views/MyGroupAbstracts'),
            meta: {auth: true},
            props: true
        },
        {
            path: '/MyGroup/:id/Abstracts/:aid',
            name: 'EditAbstractGroup',
            component: () => import('../src/views/AbsEdit'),
            meta: {auth: true},
            props: true
        },
        {
            path: '/MyGroup/:id/AbsCreate',
            name: 'NewAbstractGroup',
            component: () => import('../src/views/AbsCreate'),
            meta: {auth: true},
            props: true
        },
        {
            path: '/NewGroupCreate',
            name: 'Create new group',
            component: () => import('../src/views/NewGroupCreate'),
            meta: {auth: true}
        },
        {
            path: '/AbsCreate',
            name: 'Create new abstract',
            component: () => import('../src/views/AbsCreate'),
            meta: {auth: true}
        },
        {
            path: '/AbsEdit',
            name: 'Edit abstract',
            component: () => import('../src/views/AbsEdit'),
            meta: {auth: true}
        },
    ],
    mode: 'history'
})

router.beforeEach((to, from, next) =>{
    const currentUser = firebase.auth().currentUser
    const requireAuth = to.matched.some(Home => Home.meta.auth)

    if(requireAuth && !currentUser){
        next('/SignIn')
    }
    else{
        next()
    }
})


export default router
