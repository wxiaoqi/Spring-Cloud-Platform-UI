import fetch from '@/plugin/axios'


export function getAllGroupTypes() {
  return fetch({
    url: '/api/admin/groupType/all',
    method: 'get'
  });
}

export function fetchTree(query) {
  return fetch({
    url: '/api/admin/group/tree',
    method: 'get',
    params: query
  });
}


export function addObj(obj) {
  return fetch({
    url: '/api/admin/group',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/admin/group/' + id,
    method: 'get'
  });
}

export function delObj(id) {
  return fetch({
    url: '/api/admin/group/' + id,
    method: 'delete'
  });
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/admin/group/' + id,
    method: 'put',
    data: obj
  });
}

export function getUsers(id) {
  return fetch({
    url: '/api/admin/group/' + id + '/user',
    method: 'get'
  });
}

export function modifyUsers(id, data) {
  return fetch({
    url: '/api/admin/group/' + id + '/user',
    method: 'put',
    params: data
  });
}


export function removeElementAuthority(id, data) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/element/remove',
    method: 'put',
    params: data
  });
}

export function addElementAuthority(id, data) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/element/add',
    method: 'put',
    params: data
  });
}

export function getElementAuthority(id) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/element',
    method: 'get'
  });
}

export function modifyMenuAuthority(id, data) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/menu',
    method: 'put',
    params: data
  });
}


export function getMenuAuthority(id) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/menu',
    method: 'get'
  });
}


