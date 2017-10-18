/**
 * Created by chenlin on 2017/9/21 0021.
 */
function throwIfInvalidDate(date) {
    if (Object.prototype.toString.call(date, null) !== '[object Date]') {
        throw new Error('参数类型不对');
    }
}

function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

export function convertDate(date, format) {
    let str = format;
    const o = {
        'M+': date.getMonth() + 1,
        'D+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
    };
    if (/(Y+)/.test(format)) {
        str = str.replace(RegExp.$1,
            (date.getFullYear().toString()).substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
        if (new RegExp(`(${k})`).test(format)) {
            str = str.replace(RegExp.$1,
                (RegExp.$1.length === 1) ?
                    o[k] : (`00${o[k]}`.substr((o[k].toString()).length)));
        }
    }
    return str;
}
export function nextYear(now, index = 0) {
    throwIfInvalidDate(now);
    let date = new Date(now.getFullYear() + index, now.getMonth(), now.getDate());
    return date;
}
export function nextMonth(now, index = 0) {
    throwIfInvalidDate(now);
    const year = now.getFullYear();
    const month = now.getMonth() + index;
    const dayOfMonth = Math.min(now.getDate(), daysInMonth(year, month));
    let date = new Date(year, month, dayOfMonth);
    return date;
}
export function nextDate(now, index = 0) {
    throwIfInvalidDate(now);
    let date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + index);
    return date;
}
export function camelCase(str) {
    return str.replace(/-([a-z])/g, ($0, $1) => $1.toUpperCase()).replace('-', '');
}
/**
 * 格式化css属性对象
 * @param  {Object} props 属性对象
 * @return {Object}       添加前缀的格式化属性对象
 */
export function formatCss(props) {
    const prefixs = ['-webkit-', '-moz-', '-ms-'];
    const result = {};
    const regPrefix = /transform|transition/;
    for (let key in props) {
        if (props.hasOwnProperty(key)) {
            const styleValue = props[key];
            // 如果检测是transform或transition属性
            if (regPrefix.test(key)) {
                for (let i = 0; i < prefixs.length; i++) {
                    const styleName = camelCase(prefixs[i] + key);
                    result[styleName] = styleValue.replace(regPrefix, `${prefixs[i]}$&`);
                }
            }
            
            result[key] = styleValue;
        }
    }
    return result;
}

/**
 * 为元素添加css样式
 * @param {Object} element 目标元素
 * @param {Object} props   css属性对象
 */
export function addPrefixCss(element, props) {
    const formatedProps = formatCss(props);
    for (let key in formatedProps) {
        if (formatedProps.hasOwnProperty(key)) {
            element.style[key] = formatedProps[key];
        }
    }
}
export function shallowEqual(prev, next) {
    if (prev === next) return true;
    const prevKeys = Object.keys(prev);
    const nextKeys = Object.keys(next);
    if (prevKeys.length !== nextKeys.length) return false;
    return prevKeys.every((key) => {
        return prev.hasOwnProperty(key) && prev[key] === next[key];
    });
}