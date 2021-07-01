
/**
 *  函数防抖 设定时间内多次事件一次相应
 *
 * @param {Function} fn
 * @param {number} wait
 * @returns
 */
function debounce(fn, wait) {
    let timer;
    return function () {
        var context = this;
        var args = arguments;
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, wait);
    };
}

/**
 * 函数节流 函数每隔一段时间触发一次
 *
 * @param {Function} fn
 * @param {number} gap
 * @returns
 */
function throttle(fn, gap) {
    let begin = Date.now();
    return function () {
        let now = Date.now();
        if (now - gap > begin) {
            begin = now;
            var context = this;
            var args = arguments;
            fn.apply(context, args);
        }
    };
}
wx.throttle = throttle
wx.debounce = debounce

module.exports = {
    debounce,
    throttle
}