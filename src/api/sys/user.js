import request from '@/plugin/axios'

export function getUserPermissionInfo () {
  return request({
    url: '/api/admin/user/v2/front/info',
    method: 'get'
  })
}
