import common from '../common';
import commonActionType from '../../../consts/commonActionType';

const initialState: any = {
    userList: [],
    allDict: {},
    menuList: null,
    serverConfig: {},
    hasDAAuth: false
}

describe('common modules test', () => {
    test('user list test', () => {
        let expectData = [{ id: 1, name: 'test_01' }];
        let state = common(initialState, {
            type: commonActionType.GET_USER_LIST,
            payload: expectData
        })
        expect(state.userList).toEqual(expectData);
    })
    test('all dict test', () => {
        let expectData = { id: 1, name: 'test_01' };
        let state = common(initialState, {
            type: commonActionType.GET_ALL_DICT,
            payload: expectData
        })
        expect(state.allDict).toEqual(expectData);
    })
    test('menu list test', () => {
        let expectData = [{ id: 1, name: 'test_01' }];
        let state = common(initialState, {
            type: commonActionType.GET_ALL_MENU_LIST,
            payload: expectData
        })
        expect(state.menuList).toEqual(expectData);
    })
    test('server config test', () => {
        let expectData = { id: 1, name: 'test_01' };
        let state = common(initialState, {
            type: commonActionType.GET_SERVER_CONFIG,
            payload: expectData
        })
        expect(state.serverConfig).toEqual(expectData);
    })
    test('judge api is reachable test', () => {
        let expectData = true;
        let state = common(initialState, {
            type: commonActionType.JUDGE_API_IS_REACHABLE,
            payload: expectData
        })
        expect(state.hasDAAuth).toEqual(expectData);
    })
})
