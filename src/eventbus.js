class EventBus {
    /**
     * @desc constructor
     * @param {string} mode 模式，同步触发或者异步触发，可选值：sync，async
     */
    constructor(mode) {
        this.eventMap = {};
        this.mode = mode;
    }
    /**
     * @desc 监听事件方法
     * @param {string} name 事件名
     * @param {Function} fn 触发函数
     * @param {Boolean} isMulityListers 是否为多监听器模式，默认状态下一个事件只允许一个监听器
     */
    on(name, fn, isMulityListers) {
        const oldSub = this.eventMap[name];

        if(!oldSub) {
            const newSub = isMulityListers ? [fn] : fn;
            this.eventMap[name] = newSub;
        }
        else {
            if(isMulityListers && Array.isArray(oldSub)) {
                oldSub.push(fn);
            }
            else if(isMulityListers && typeof oldSub === 'function') {
                this.eventMap[name] = [oldSub, fn];
            }
            else if(!isMulityListers) {
                console.error(`禁止在单监听器模式下，对同一事件绑定多个触发函数，如需要请设置on方法的isMulityListers为true\nEventBus.on(name, fn, isMulityListers = false)`);
            }
            else {
                this._throwEventMapTypeError(name, oldSub);
            }
        }
    }
    /**
     * @desc 触发事件方法
     * @param {string} name 事件名
     * @param {*} arg 传给触发函数的参数
     */
    emit(name, ...arg) {
        const sub = this.eventMap[name];
        if(!sub) {
            this._throwNoEventWarn(name);
        }
        else if(typeof sub === 'function') {
            this._callSubFn(sub, ...arg);
        }
        else if(Array.isArray(sub)) {
            sub.forEach(fn => this._callSubFn(fn, ...arg));
        }
        else {
            this._throwEventMapTypeError(name, sub);
        }
    }
    /**
     * @desc 取消事件绑定
     * @param {string} name 事件名
     * @param  {...Function} fns 所绑定的监听函数，可传多个
     */
    off(name, ...fns) {
        const oldSub = this.eventMap[name];
        if(oldSub === undefined) {
            this._throwNoEventWarn(name);
        }
        else if(typeof oldSub === 'function') {
            Reflect.deleteProperty(this.eventMap, name);
        }
        else if(Array.isArray(oldSub)) {
            this.eventMap[name] = oldSub.filter(sub => !fns.includes(sub));
        }
        else {
            this._throwEventMapTypeError(name, oldSub);
        }
    }
    /**
     * @desc 取消所有事件绑定
     * @param {string} name 事件名
     */
    offAll(name) {
        const oldSub = this.eventMap[name];
        if(oldSub === undefined) {
            this._throwNoEventWarn(name);
        }
        else if(typeof oldSub === 'function' || Array.isArray(oldSub)) {
            Reflect.deleteProperty(this.eventMap, name);
        }
        else {
            this._throwEventMapTypeError(name, oldSub);
        }
    }
    /**
     * @desc 只会触发一次的方法
     * @desc 禁止在async模式下使用，因为异步情况下调用时机是不可预测的；禁止对同一事件名绑定多个监听函数
     * @param {string} name 事件名
     * @param {Function} fn 触发函数
     */
    once(name, fn) {
        const oldSub = this.eventMap[name];
        if(oldSub) console.error(`绑定事件失败：事件${ name }已存在，once应当使用唯一的事件名`);
        
        if(this.mode !== 'async') console.error(`once方法只允许在sync模式下执行`);

        this.eventMap[name] = (...arg) => {
            fn(...arg);
            this.off(name);
        };
    }
    /**
     * @desc 清楚所有事件监听
     */
    clear() {
        this.eventMap = {};
    }

    /**
     * @desc 用于触发监听函数
     * @param {Function} fn 
     */
    _callSubFn(fn, ...arg) {
        const mode = this.mode;
        if(mode === 'sync') fn(...arg);
        else if(mode === 'async') Promise.resolve().then(() => fn(...arg));
        else console.log(`不合法的mode值：${ mode }`)
    }

    _throwEventMapTypeError(name, oldSub) {
        console.log(`eventMap中的${ name }为不被允许的值，必须为函数或者数组:${ oldSub }`);
    }
    _throwNoEventWarn(name) {
        console.warn(`事件名"${ name }"未绑定任何触发函数`);
    }
}
export default EventBus;