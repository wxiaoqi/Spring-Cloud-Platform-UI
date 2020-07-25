import request from '@/plugin/axios'

export function page (query) {
  return request({
    url: '/api/code/generator/page',
    method: 'get',
    params: query
  })
}

export function dbs () {
  return request({
    url: '/api/code/generator/dbs',
    method: 'get'
  })
}

export function generateCode (tables) {
  const data = { tables }
  return request({
    url: '/api/code/generator/build',
    method: 'post',
    params: data,
    responseType: 'blob' // 表明返回服务器返回的数据类型'
  })
}
