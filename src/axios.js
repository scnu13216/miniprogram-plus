
let _baseUrl = ""
let _apiMap = {}
let _headers = {}
let _timeout = 5000


class Axios {

    constructor({
        baseUrl,
        timeout,
        headers,
        apiMap
    }) {
        _baseUrl = baseUrl || _baseUrl
        _headers = headers || _headers
        _timeout = timeout || _timeout
        _apiMap = apiMap || _apiMap

        // 允许注入请求前后处理
        let interceptors = {
            request: {
                use: (func) => {
                    interceptors.request = func
                }
            },
            response: {
                use: (func) => {
                    interceptors.response = func
                }
            }
        }
        this.interceptors = interceptors
    }

    post = async function ({
        api,
        data,
        headers,
        dataType = 'json',
        callback,
        loading = true
    }) {
        let before_res = beforeRequest.call(this, {
            api,
            data,
            headers
        })
        let res = {}
        if (before_res) {
            if (loading) {
                wx.showLoading({
                    title: '加载中',
                    mask: true
                });
            }
            res = await post(
                Object.assign({
                    data,
                    headers,
                    dataType,
                    callback
                },
                    before_res
                )
            )
        } else {
            return false
        }
        let after_res = afterRequest.call(this, res)
        wx.hideLoading()
        if (typeof callback == 'function') {
            callback(after_res)
        }
        return true
    }


    get = async function ({
        api,
        data,
        headers,
        dataType = 'json',
        callback,
        loading = true
    }) {
        let before_res = beforeRequest.call(this, {
            api,
            data,
            headers,
            dataType
        })
        let res = {}
        if (before_res) {
            if (loading) {
                wx.showLoading({
                    title: '加载中',
                    mask: true
                });
            }
            res = await get(
                Object.assign({
                    data,
                    headers,
                    dataType,
                    callback
                },
                    before_res
                )
            )
        } else {
            return false
        }
        let after_res = afterRequest.call(this, res)
        wx.hideLoading()
        if (typeof callback == 'function') {
            callback(after_res)
        }
        return after_res
    }

}


function beforeRequest({
    api,
    data,
    headers,
    dataType
}) {

    let config = {
        url: api,
        data,
        headers,
        timeout: _timeout,
        dataType,
    }
    if (!api) {
        wx.showToast({
            title: '接口配置异常',
            icon: 'none'
        });
        console.warn(`接口配置异常： 没有传api进来！`)
        return false
    }
    if (!api.match(/^http(s?):\/\//g)) {
        // 默认服务请求
        if (_apiMap.hasOwnProperty(api)) {
            wx.showToast({
                title: '接口配置异常',
                icon: 'none'
            });
            console.warn(`接口配置异常： ${api} 没找到`)
            return false
        } else {
            config.url = _apiMap[api]
            if (!config.url.match(/^http(s?):\/\//g)) {
                config.url = _baseUrl + config.url
            }
        }
    }
    // 到这里拿到最后请求的api地址
    if (!config.url.match(/^http(s?):\/\//g)) {
        wx.showToast({
            title: '接口异常',
            icon: 'none'
        });
        console.warn(`接口链接不正确: url ${config.url}`)
        return false
    }

    if (typeof data != 'object') {
        wx.showToast({
            title: '请求数据异常',
            icon: 'none'
        });
        console.warn(`接口请求数据异常 data:${data}`)
        return false
    }

    if (typeof this.interceptors.request == 'function') {
        // 执行前处理
        config = this.interceptors.request(config)
    }
    config.headers = Object.assign(_headers, config.headers)
    return config
}

function afterRequest(res) {
    if (typeof this.interceptors.response == 'function') {
        res = this.interceptors.response(res)
    }
    return res
}

function post(config) {
    return new Promise((resolve, reject) => {
        wx.request({
            ...config,
            method: 'POST',

            success: (res) => {
                resolve(res.data)
            },
            fail: (e) => {
                console.error(e)
                wx.hideLoading()
                reject()
            }
        })
    })
}

function get(config) {
    return new Promise((resolve, reject) => {
        wx.request({
            ...config,
            method: 'GET',
            timeout: _timeout,
            success: (res) => {
                resolve(res.data)
            },
            fail: (e) => {
                console.error(e)
                wx.hideLoading()
                reject()
            }
        })
    })
}




module.exports = Axios