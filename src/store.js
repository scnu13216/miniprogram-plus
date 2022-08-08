const app = getApp()

/* 扩展页面和组件可以直接获取全局状态 */
class Store {
    getters
    component_stack
    constructor() {
        this.component_stack = {}
        this.getters = app.store.getters
        autoStore()
    }



    commit(key, value) {
        if (app.store.mutations.hasOwnProperty(key)) {
            let target_property = app.store.mutations[key](value);
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
                return state[key]
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