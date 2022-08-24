const app = getApp()

/* 扩展页面和组件可以直接获取全局状态 */
class Store {
    getters
    component_stack
    ignoreKey
    constructor({
        ignoreKey = []
    }) {
        this.component_stack = {}
        this.getters = app.store.getters
        this.ignoreKey = ignoreKey
        // 支持缓存，是同层的
        syncStorage(ignoreKey)
        autoStore()
    }



    commit(key, value) {
        if (app.store.mutations.hasOwnProperty(key)) {
            let target_property = app.store.mutations[key](value);
            // 注意处理被忽略的
            if (!this.ignoreKey.includes(target_property)) {
                wx.setStorageSync(target_property, value)
            }
            // 更新仓库之后，检查 component_stack 里面被检查出与仓库数据有关的计算属性
            for (const key in this.component_stack) {
                const component = this.component_stack[key]
                if (component.hasOwnProperty('computed_obj')) {
                    // 检查启用计算属性
                    if (component.computed_obj.hasOwnProperty(target_property)) {
                        // 执行更新
                        component.computed_obj[target_property].forEach(v => {
                            component[v]()
                        })
                    }
                }
            }
        }
    }

    dispatch(key) {
        try {
            if (app.store.actions.hasOwnProperty(key)) {
                app.store.actions[key](this);
            }
        } catch (error) {
            console.error(error)
        }
    }


}

function autoStore() {
    for (const key in app.store.state) {
        let getter_key = key
        if (!app.store.getters.hasOwnProperty(getter_key)) {
            app.store.getters[getter_key] = ((state) => {
                if (typeof state[key] == 'object') {
                    try {
                        return JSON.parse(JSON.stringify(state[key]))
                    } catch (error) {
                        return state[key]
                    }
                } else {
                    return state[key]
                }

            })(app.store.state)
        }
        let mutation_key = `set${String(key).firstUpperCase()}`
        if (!app.store.mutations.hasOwnProperty(mutation_key)) {
            app.store.mutations[mutation_key] = (x) => {
                app.store.state[key] = x
                app.store.getters[key] = x
                return key
            }
        }
    }
}

function syncStorage(ignoreKey) {
    let {
        keys: storageKeys
    } = wx.getStorageInfoSync()
    let storeKeys = Object.keys(app.store.state) || []
    storeKeys.forEach(v => {
        if (ignoreKey.includes(v)) {
            wx.removeStorageSync(v)
        } else {
            if (storageKeys.includes(v)) {
                app.store.state[v] = wx.getStorageSync(v)
            } else {
                wx.setStorageSync(v, app.store.state[v])
            }
        }
    })
}

/* 
    扩展 String 对象
    首字母大写
*/
String.prototype.firstUpperCase = function () {
    return this.replace(/\b(\w)(\w*)/g, function ($0, $1, $2) {
        return $1.toUpperCase() + $2;
    });
}


module.exports = Store