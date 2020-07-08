export default {
    // 项目名称，作为当前配置项的唯一标识符，必填
    name: 'old',
    // 必填，指定加载的类型，为资源或者项目，枚举：project，resource
    type: 'project',
    // 非必填，指定一个根元素，当前项目的html元素会被加载到此元素下
    root: '#oldApp',
    // 必填，加载优先级，小数字代表高优先级
    priority: 1,
    // 当type === project时必填，因为要通过发起跨域请求去获取到目标项目的主页面内容，所以需要进行一层代理
    proxyUrl: './getOldHtml/index.html',
    // 非必填，当type === resource时有效，要加载的js文件
    scripts: [],
    // 非必填，当type === resource时有效，要加载的样式文件
    styles: [],
    // 非必填，指定后，符合正则匹配的资源将不会被加载
    exceptResourceRule: /^a.js$/,
    // 非必填，指定后会为所有的资源文件(不是一个完整链接的文件地址，即不包含domain的文件)添加的前缀地址，一般来说，即为代理地址
    prefixUrl: './getOldHtml',
    // 当前项目js文件加载前钩子
    beforeLoad() {
        // ...
    },
    // 当前项目所有js文件(不包括内联的js)加载后钩子
    afterLoad() {
        // ...
    },
    // 非必填，路由规则，只有在当前路由下，才会显示root元素
    // 如果不指定，则在任何情况下都会显示root元素
    // 如果指定，则在路由匹配的情况下，才会显示root元素，不匹配的情况下会为root元素设置display:none
    // 暂时只支持hash模式
    routesRule: /^printBatch$/,
    // 使用沙箱模式，此配置项会将当前项目配置下的，符合匹配条件的js文件运行在一个独立的window对象下
    // 一般的，不是很建议使用，如果用到了一些全局变量以外的东西，容易产生一些不可预见的错误
    // 考虑是否可以维护一组属性的集合，当访问window下的某些属性在这个集合中时，访问的是真实的window对象
    useSandbox: false,
    // 满足此正则的文件，使用沙箱模式，前置配置useSandbox: true，默认为当前配置下的所有文件都支持
    sandboxRule: /1.js/,
}