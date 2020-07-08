// 请求方法，这里为了方便使用fetch，也可使用ajax，因为只是为了获取资源用，即只涉及到get方法，所以不需要配置参数
function request(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(res => res.text())
            .then(str => resolve(str))
            .catch(err => reject(err));
    })
}

export default request;