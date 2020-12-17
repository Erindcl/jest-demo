import { getApiMarketValue, isJSON, transformTableToCsv, textOverflowEllipsis } from '../index';

describe('utils func test', () => {
    test('getApiMarketValue test', () => {
        const expectData = 'api_01';
        const paramData = {
            key: 'name',
            apiMarket: {
                api: {
                    1: { id: 1, name: expectData }
                }
            },
            apiId: 1
        }
        const resultData = getApiMarketValue(paramData.key, paramData.apiMarket, paramData.apiId);
        expect(resultData).toEqual(expectData);
        expect(getApiMarketValue(paramData.key, {}, paramData.apiId)).toEqual(null);
    })
    test('isJSON test', () => {
        expect(isJSON('{"a": "456", "b": "123"}')).toEqual(true)
        expect(isJSON({ a: '456', b: '123' })).toEqual(false);
        expect(isJSON('{ a: "456", b: "123" }')).toEqual(false);
    })
    test('transformTableToCsv test', () => {
        const paramData = {
            columns: [{ title: 'col1', dataIndex: 'col1' }, { title: 'col2', dataIndex: 'col2' }, { title: 'col3', dataIndex: 'col3' }],
            dataSource: [{ col1: 1, col2: { a: 1 }, col3: undefined }]
        };
        const expectData = 'col1,col2,col3\n"1","{""a"":1}",""\n';
        expect(transformTableToCsv(paramData.columns, paramData.dataSource)).toEqual(expectData);
        expect(transformTableToCsv(paramData.columns, [])).toEqual('col1,col2,col3\n');
    })
    test('textOverflowEllipsis test', () => {
        const paramData = {
            text: '我是一串很长长长长长的文字',
            num: 10,
            shortText: '我不长',
            notText: 1
        };
        const expectData = '我是一串很长长长长长...';
        expect(textOverflowEllipsis(paramData.text, paramData.num)).toEqual(expectData);
        expect(textOverflowEllipsis(paramData.text)).toEqual(paramData.text);
        expect(textOverflowEllipsis(paramData.shortText, paramData.num)).toEqual(paramData.shortText);
        expect(textOverflowEllipsis(paramData.notText, paramData.num)).toEqual(paramData.notText);
    })
})
