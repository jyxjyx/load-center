import processTpl from './process-tpl';
import request from './request';
import routerControler from './router-control';
import { loadJsResource, loadCssResource } from './load-resource';

function startLoad(configs) {
    const sortedConfigs = configs.sort((a,b) => a.priority - b.priority);
    console.log({sortedConfigs})
    sortedConfigs.forEach(async config => {
        const {
            type,
            root,
            proxyUrl,
            prefixUrl = '',
            scripts,
            styles,
            exceptResourceRule,
        } = config;

        let { jsResource, cssResource } = await dealResourceUrl({
            type,
            root,
            proxyUrl,
            prefixUrl,
            scripts,
            styles
        });

        if(exceptResourceRule) {
            jsResource = jsResource.filter(item => !exceptResourceRule.test(item));
            cssResource = cssResource.filter(item => !exceptResourceRule.test(item));
        }

        loadCssResource(cssResource, config);
        loadJsResource(jsResource, config);

    });
    // 初次加载时，初始化路由控制
    routerControler(configs);
}

/**
 * @desc 根据配置项，处理出所需要加载的js和css资源对象
 * @param { Object } config 此函数用到的config配置项 
 * @return  { Object } 包含jsResource,cssResource资源集合的对象
 */
async function dealResourceUrl({
    type,
    root,
    proxyUrl,
    prefixUrl,
    scripts,
    styles
}) {
    let jsResource = scripts || [];
    let cssResource = styles || [];
    // 如果是project模式，需要先获取到目标项目的地址
    if(type === 'project') {
        // 获取并加载代理页面的资源，并将其加入root节点
        if(proxyUrl) {
            const htmlStr = await request(proxyUrl);
            const parseResult = processTpl(htmlStr, prefixUrl);
            console.log(parseResult)

            if(root && document.querySelector(root)) {
                document.querySelector(root).innerHTML = parseResult.template;
            }
            jsResource = parseResult.scripts;
            cssResource = parseResult.styles;
        }
    }
    else if(type === 'resource') {
        jsResource = jsResource.map(item => prefixUrl + item);
        cssResource = cssResource.map(item => prefixUrl + item);
    }

    return {
        jsResource,
        cssResource
    }
}

export default startLoad;