
export default {
    createElement(argument) {
        var _a;
        var option = {};
        if (typeof argument === "string" || Array.isArray(argument)) {
            option.class = argument;
        }
        else if (argument) {
            if (argument.id)
                option.id = argument.id;
            if (argument.name)
                option.name = argument.name;
            if (argument.class)
                option.class = argument.class;
        }
        option.name = option.name ? option.name : "div";
        var el = document.createElement(option.name);
        if (option.class) {
            if (typeof option.class === "string") {
                el.className = option.class;
            }
            else if (Array.isArray(option.class)) {
                (_a = el.classList).add.apply(_a, option.class);
            }
        }
        if (option.id) {
            el.setAttribute("id", option.id);
        }
        return el;
    },
    pathFilter(urlTemplate, params) {
        // 替换模板中的参数
        params.forEach(([key, value]) => {
            urlTemplate = urlTemplate.replace(`{${key}}`, value)
        })
        return urlTemplate
    },
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        if (i >= 5) {
            const resultNum = parseFloat((bytes / Math.pow(k, i))) * Math.pow(k, i - 4)
            return parseFloat(resultNum.toFixed(decimals)) + 'TB'
        } else {
            return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + sizes[i]
        }
    },
    sortByProperty(array, property, order = 'asc', sortType = 'number', prop = 'isDir') {
        const sortedArr = []
        array.sort((a, b) => {
            let comparison = 0
            if (sortType === 'number') {
                if (a[property] < b[property]) {
                    comparison = -1
                } else if (a[property] > b[property]) {
                    comparison = 1
                }
            } else if (sortType === 'date') {
                const aTime = new Date(a[property]).getTime()
                const bTime = new Date(b[property]).getTime()
                if (aTime < bTime) {
                    comparison = -1
                } else if (aTime > bTime) {
                    comparison = 1
                }
            } else if (sortType === 'string') {
                if (a[property].length < b[property].length) {
                    comparison = -1
                } else if (a[property].length > b[property].length) {
                    comparison = 1
                }
            }
            return (order === 'desc') ? comparison * -1 : comparison
        })
        for (const obj of array) {
            if (obj[prop] === true) {
                sortedArr.unshift(obj)
            } else {
                sortedArr.push(obj)
            }
        }
        return sortedArr
    }
}
