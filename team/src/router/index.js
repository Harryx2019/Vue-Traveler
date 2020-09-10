import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Index from "../views/Index.vue"
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Team from "../views/Team.vue";
import SearchTeam from "../views/SearchTeam.vue"
import CreateTeam from "../views/CreateTeam.vue"
import MyCreateTeam from "../views/MyCreateTeam.vue"
import MyJoinTeam from "../views/MyJoinTeam.vue"
import MessageApply from "../views/MessageApply.vue"
import MessageStatus from "../views/MessageStatus.vue"
import MyInfo from "../views/MyInfo.vue"
import MyPass from "../views/MyPass.vue"

Vue.use(VueRouter)

const routes = [{
    path: '/',
    component: Home,
    children: [{
        path: '/',
        name: 'Index',
        component: Index,
        meta: {
          title: '首页—Traveler组队交友平台'
        }
      },
      {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
          title: '登录—Traveler组队交友平台'
        }
      },
      {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {
          title: '注册—Traveler组队交友平台'
        }
      }
    ]
  },
  {
    path: '/team',
    component: Team,
    children: [{
      path: '/team',
      name: 'SearchTeam',
      component: SearchTeam,
      meta: {
        title: '寻找小队—Traveler组队交友平台'
      }
    }, {
      path: '/createTeam',
      name: 'CreateTeam',
      component: CreateTeam,
      meta: {
        title: '创建小队—Traveler组队交友平台'
      }
    },{
      path: '/myCreateTeam',
      name: 'MyCreateTeam',
      component: MyCreateTeam,
      meta: {
        title: '我创建的小队—Traveler组队交友平台'
      }
    },{
      path: '/myJoinTeam',
      name: 'MyJoinTeam',
      component: MyJoinTeam,
      meta: {
        title: '我加入的小队—Traveler组队交友平台'
      }
    },{
      path: '/messageApply',
      name: 'MessageApply',
      component: MessageApply,
      meta: {
        title: '入队申请—Traveler组队交友平台'
      }
    },{
      path: '/messageStatus',
      name: 'MessageStatus',
      component: MessageStatus,
      meta: {
        title: '申请状态—Traveler组队交友平台'
      }
    },{
      path: '/myInfo',
      name: 'MyInfo',
      component: MyInfo,
      meta: {
        title: '个人信息—Traveler组队交友平台'
      }
    },{
      path: '/myPass',
      name: 'MyPass',
      component: MyPass,
      meta: {
        title: '修改密码—Traveler组队交友平台'
      }
    }]
  }
]

const router = new VueRouter({
  routes
})

export default router