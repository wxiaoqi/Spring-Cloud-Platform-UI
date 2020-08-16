import fetch from '@/plugin/axios'

// 查询在线用户列表
export function list (query) {
  return fetch({
    url: '/api/auth/online/page',
    method: 'get',
    params: query
  })
}

// 强退用户
export function forceLogout (tokenId) {
  return fetch({
    url: '/api/auth/online/' + tokenId,
    method: 'delete'
  })
}
