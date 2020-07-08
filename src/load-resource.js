import request from './request';

/**
 * @desc 加载项目的js资源
 * @param { Array:string } scripts script标签集合（包含内联脚本）
 * @param { Object } config 当前的配置文件对象，用来作为beforeLoad和afterLoad的上下文环境，即this
 */
export async function loadJsResource(scripts, config) {
    const { beforeLoad, afterLoad, useSandbox, sandboxRule, name } = config;
    const inlineReg = /^(<script[\s\S]*>)([\s\S]+)(<\/script>)$/;

    // 调用beforeLoad钩子
    if(typeof beforeLoad === 'function') beforeLoad.apply(config);

    for(let i = 0; i < scripts.length; i++) {
        const scriptItem = scripts[i];
        let content;
        if(inlineReg.test(scriptItem)) {
            content = inlineReg.exec(scriptItem)[2];
        }
        else {
            content = await request(scriptItem);
            // 沙箱模式
            if(useSandbox) {
                if(!(sandboxRule instanceof RegExp)) console.error('sandboxRule类型错误，应为正则表达式');
                else if(!sandboxRule || sandboxRule.test(scriptItem)) {
                    const newWindow = createNewWindowObj();
                    window[`newWindow_${ name }`] = newWindow;
                    content = `(function(window){${ content }})(newWindow_${ name })`;
                    count++;
                }
            }
        }
        const fn = Function(content);
        fn();
    }
    // 调用afterLoad钩子
    if(typeof afterLoad === 'function') afterLoad.apply(config);
}

/**
 * @desc 加载项目的css资源
 * @param { Array:string } styles link标签集合（不包含style标签）
 */
export function loadCssResource(styles) {
    styles.forEach(item => {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.type = 'text/css';
        cssLink.href = item;
        document.querySelector('head').appendChild(cssLink);
    })
}

// 创建新的window对象，在重构项目中使用此window代替原有的window对象，防止全局对象污染
export function createNewWindowObj() {
    const iframeEle = document.createElement('iframe');
    iframeEle.style.display = 'none';
    document.querySelector('body').appendChild(iframeEle);
    return iframeEle.contentWindow;
}
