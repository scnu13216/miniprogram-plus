// 如果想把接口封装成方法，也可以用这种方式完成。
// 记得要 return 请求方法
const app = getApp()
function test1({data,headers,loading} = {}) {
    return app.$axios.get({
        api: "https://tcc.taobao.com/cc/json/mobile_tel_segment.htm",
        headers: {
            'content-type': 'application/javascript;charset=GBK'
        },
        data: {
            tel: `17336132487`
        },
        loading: false
    })
}
export {
    test1
}