import request from '@/plugin/axios'

export function AccountLogin(data) {
  return request({
    url: '/api/auth/jwt/token',
    method: 'post',
    data,
    loading: {
      type: 'loading',
      options: {
        fullscreen: true,
        lock: true,
        text: '正在登陆...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)'
      }
    }
  })
}
