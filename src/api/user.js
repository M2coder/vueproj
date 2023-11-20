import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/radar/data/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/radar/data/user/getinfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/radar/data/user/logout',
    method: 'post'
  })
}
