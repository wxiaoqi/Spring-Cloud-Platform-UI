import fetch from '@/plugin/axios'

export function page(query) {
  return fetch({
    url: '/api/auth/service/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return fetch({
    url: '/api/auth/service',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return fetch({
    url: '/api/auth/service/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/auth/service/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/auth/service/' + id,
    method: 'put',
    data: obj
  })
}

export function getClients(id) {
  return fetch({
    url: '/api/auth/service/' + id + '/client',
    method: 'get'
  })
}

export function modifyClients(id, data) {
  return fetch({
    url: '/api/auth/service/' + id + '/client',
    method: 'put',
    params: data
  })
}