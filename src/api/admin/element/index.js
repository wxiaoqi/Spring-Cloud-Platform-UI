import fetch from '@/plugin/axios'

export function page (query) {
  return fetch({
    url: '/api/admin/element/list',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return fetch({
    url: '/api/admin/element',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return fetch({
    url: '/api/admin/element/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return fetch({
    url: '/api/admin/element/' + id,
    method: 'delete'
  })
}

export function putObj (id, obj) {
  return fetch({
    url: '/api/admin/element/' + id,
    method: 'put',
    data: obj
  })
}
