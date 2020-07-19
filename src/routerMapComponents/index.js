import layoutHeaderAside from '@/layout/header-aside'
const files = require.context('./', true, /\.js$/)

let componentMaps = {
  'layoutHeaderAside': layoutHeaderAside,
  // 'menu': () => import(/* webpackChunkName: "menu" */'@/pages/sys/menu'),
  // 'route': () => import(/* webpackChunkName: "route" */'@/pages/sys/route'),
  // 'role': () => import(/* webpackChunkName: "role" */'@/pages/sys/role'),
  // 'user': () => import(/* webpackChunkName: "user" */'@/pages/sys/user'),
  // 'interface': () => import(/* webpackChunkName: "interface" */'@/pages/sys/interface'),
  'serviceManager': () => import(/* webpackChunkName: "serviceManager" */'@/pages/auth/service/index'),
  'userManager': () => import(/* webpackChunkName: "userManager" */'@/pages/admin/user'),
  'groupManager': () => import(/* webpackChunkName: "groupManager" */'@/pages/admin/group'),
  'menuManager': () => import(/* webpackChunkName: "menuManager" */'@/pages/admin/menu'),
  'groupTypeManager': () => import(/* webpackChunkName: "userManager" */'@/pages/admin/groupType')
}
files.keys().forEach((key) => {
  if (key === './index.js') return
  Object.assign(componentMaps, files(key).default)
})
export default componentMaps
