import fetch from '@/plugin/axios'

export function page (query) {
  return fetch({
    url: '/api/admin/user/page',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return fetch({
    url: '/api/admin/user',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return fetch({
    url: '/api/admin/user/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return fetch({
    url: '/api/admin/user/' + id,
    method: 'delete'
  })
}

export function putObj (id, obj) {
  return fetch({
    url: '/api/admin/user/' + id,
    method: 'put',
    data: obj
  })
}
