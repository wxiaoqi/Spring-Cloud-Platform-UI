import layoutHeaderAside from '@/layout/header-aside'
const files = require.context('./', true, /\.js$/)

let componentMaps = {
  'layoutHeaderAside': layoutHeaderAside,
  'serviceManager': () => import(/* webpackChunkName: "serviceManager" */'@/pages/auth/service/index'),
  'userManager': () => import(/* webpackChunkName: "userManager" */'@/pages/admin/user'),
  'groupManager': () => import(/* webpackChunkName: "groupManager" */'@/pages/admin/group'),
  'menuManager': () => import(/* webpackChunkName: "menuManager" */'@/pages/admin/menu'),
  'gateLogManager': () => import(/* webpackChunkName: "gateLogManager" */'@/pages/admin/gateLog'),
  'groupTypeManager': () => import(/* webpackChunkName: "groupTypeManager" */'@/pages/admin/groupType'),
  'devFormManager': () => import(/* webpackChunkName: "devFormManager" */'@/pages/dev/build'),
  'codeManager': () => import(/* webpackChunkName: "codeManager" */'@/pages/dev/code'),
  'onlineManager': () => import(/* webpackChunkName: "onlineManager" */'@/pages/admin/online')

}
files.keys().forEach((key) => {
  if (key === './index.js') return
  Object.assign(componentMaps, files(key).default)
})
export default componentMaps
