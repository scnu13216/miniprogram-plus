let _baseUrl = ""
let _apiMap = {}
let _header = {}
let _timeout = 5000


class Axios {

    constructor({
        baseUrl,
        timeout,
        header,
        apiMap
    }) {
        _baseUrl = baseUrl || _baseUrl
        _header = header || _header
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
        header,
        dataType = 'json',
        callback,
        loading = true
    }) {
        let before_res = beforeRequest.call(this, {
            api,
            data,
            header
        })
        let res = {}
        let config = { data, header, dataType, callback }
        if (before_res) {
            if (loading) {
                wx.showLoading({
                    title: '加载中',
                    mask: true
                });
            }
            config = { data, header, dataType, callback, ...before_res }
            res = await post(config)
        } else {
            return false
        }
        let after_res = afterRequest.call(this, res, config)
        wx.hideLoading()
        if (typeof callback == 'function') {
            callback(after_res)
        }
        return after_res
    }


    get = async function ({
        api,
        data,
        header,
        dataType = 'json',
        callback,
        loading = true
    }) {
        let before_res = beforeRequest.call(this, {
            api,
            data,
            header,
            dataType
        })
        let res = {}
        let config = { data, header, dataType, callback }
        if (before_res) {
            if (loading) {
                wx.showLoading({
                    title: '加载中',
                    mask: true
                });
            }
            config = { data, header, dataType, callback, ...before_res }
            res = await get(config)
        } else {
            return false
        }
        let after_res = afterRequest.call(this, res, config)
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
    header,
    dataType
}) {

   
    if (!api) {
        wx.showToast({
            title: '接口配置异常',
            icon: 'none'
        });
        console.warn(`接口配置异常： 没有传api进来！`)
        return false
    }
    if (!data || typeof data != 'object') {
        data = {}
    }
    if(!header || typeof header != 'object'){
        header = {}
    }
    let config = {
        url: api,
        data,
        header,
        timeout: _timeout,
        dataType,
    }
    if (!api.match(/^http(s?):\/\//g)) {
        // 默认服务请求
        if (!_apiMap.hasOwnProperty(api)) {
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
                config.isExLink = false
            } else {
                config.isExLink = true
            }
        }
    }
    else {
        config.isExLink = true
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


   

    if (typeof this.interceptors.request == 'function') {
        // 执行前处理
        config = this.interceptors.request(config)
    }

    config.header = {
        ..._header,
        ...config.header
    }
    return config
}

function afterRequest(res, config) {
    if (typeof this.interceptors.response == 'function') {
        // 如果是指定其他链接就不执行交易后处理
        if (config.isExLink) {
            return res
        } else {
            res = this.interceptors.response(res)
        }
    }
    return res
}

function post(config) {
    return new Promise((resolve, reject) => {
        wx.request({
            ...config,
            method: 'POST',

            success: (res) => {
                if (res.statusCode != 200) {
                    wx.showToast({ title: '客官别急，网络掉线了！' });
                    reject()
                } else {
                    // 服务异常
                    resolve(res.data)
                }
            },
            fail: (e) => {
                // 网络不通
                wx.hideLoading()
                wx.showToast({ title: '客官别急，网络掉线了！' });
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