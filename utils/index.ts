export function getApiMarketValue (key: any, apiMarket: any, apiId: any) {
    const api = apiMarket && apiMarket.api && apiMarket.api[apiId];

    if (api) {
        return api[key];
    } else {
        return null;
    }
}

export function isJSON (str: any) {
    if (typeof str == 'string') {
        try {
            let obj = JSON.parse(str);
            if (obj && typeof obj == 'object') {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    } else {
        return false;
    }
}

export function transformTableToCsv (columns: any, dataSource: any) { // table数据转换为CSV
    let str = '';
    let keys = [];
    str += columns.reduce((pre: string, curr: any, index: number) => {
        keys.push(curr.dataIndex);
        if (index === 0) {
            return curr.title;
        } else {
            return pre + ',' + curr.title;
        }
    }, '');
    str += '\n';
    str += dataSource.reduce((pre: string, curr: any) => {
        let tempStr = '';
        let tempArr = [];
        keys.forEach((ele: any, kIndex: number) => {
            let dealStr = '';
            // 处理非字符串数据 如 对象 数组
            if (curr[ele] === null || curr[ele] === undefined) {
                dealStr = '';
            } else if (typeof curr[ele] === 'object') {
                dealStr = JSON.stringify(curr[ele]);
            } else {
                dealStr = curr[ele] + '';
            }
            // 首位添加引号是为了处理字符串中的逗号
            // replace 是为了处理字符串中自带引号 带来的麻烦
            // eslint-disable-next-line
            tempArr.push('"' + dealStr.replace(/\"/g, "\"\"") + '"');
        })
        tempStr = tempArr.join(',');
        tempStr += '\n';
        return pre + tempStr;
    }, '');
    return str
}

export function textOverflowEllipsis (text: any, num?: number) { // 文字超出长度显示省略号
    if (typeof text !== 'string') {
        return text;
    }
    const realNum = num || 20;
    return text.length > realNum ? text.slice(0, realNum) + '...' : text;
}

/*
** randomWord 产生任意长度随机字母数字组合
** randomFlag 是否任意长度 min 任意长度最小位[固定位数] max 任意长度最大位
*/
export function randomWord (randomFlag: boolean, min: number, max?: number) {
    let str = '';
    let range = min;
    let arr = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ];
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;// 任意长度
    }
    for (let i = 0; i < range; i++) {
        let pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
}
