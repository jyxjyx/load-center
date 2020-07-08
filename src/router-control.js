// 根据hash路由控制视图变更
function routerControler(configs) {
    // 初始化
    controlRootByRoutesRule(getCurHash(), configs);

    window.addEventListener('hashchange', () => {
        controlRootByRoutesRule(getCurHash(), configs);
    })
}
// 根据路由规则进行匹配
function controlRootByRoutesRule(hash, configs) {
    configs.forEach(({
        name,
        root,
        routesRule
    }) => {
        if(!routesRule) return false;

        if(!(routesRule instanceof RegExp)) {
            console.error(`config.js中的name为"${ name }"的配置项错误，routesRule将被忽略，其应为正则表达式`);
            return false;
        } 
        // 对有路由规则的配置项进行路由规则匹配
        controlRootVisible(root, !!routesRule.exec(hash));
    })
}
// 获得当前页面的hash值
function getCurHash() {
    return window.location.hash.split('?')[0];
}
// 控制根元素的显示与隐藏
function controlRootVisible(root, isShow) {
    const rootEle = document.querySelector(root);
    if(rootEle) {
        rootEle.style.display = isShow ? 'inherit' : 'none';
    }    
}
export default routerControler;