import configureMockStore from 'redux-mock-store'; // eslint-disable-line
import thunk from 'redux-thunk';
import { dashBoardActions } from '../dashBoard';
import { dashBoardActionType as ACTION_TYPE } from '../../consts/dashBoardActionType';
import API from '../../api/dashBoard';

jest.mock('../../api/dashBoard');

const middlewares: any = [thunk];
const mockStore = configureMockStore(middlewares)

describe('dashBoard actions', () => {
    test('getApiCallInfo action', async () => {
        const infoList: any[] = [{ time: 1603701000000, callCount: 0, failRate: 0 }];
        const res: any = {
            code: 1,
            data: {
                infoList,
                apiNum: 0,
                callCount: 22,
                failRate: 100,
                totalCount: 385
            }
        };
        const date = '2020-10-11';
        (API.getApiCallInfoForManager as any).mockResolvedValue(res);

        const expectActions: any = [{
            type: ACTION_TYPE.GET_MARKET_CALL_INFO,
            payload: {
                callCount: res.data.callCount,
                failPercent: res.data.failRate,
                apiNum: res.data.apiNum,
                infoList: res.data.infoList
            },
            date: date
        }]

        const store = mockStore({});
        await dashBoardActions.getApiCallInfo({ time: '1' }, true, date)(store.dispatch);
        const newtActions = store.getActions();
        expect(newtActions).toEqual(expectActions);
    })
    test('getApprovedMsgCount action', async () => {
        const res: any = {
            code: 1,
            data: 10
        };
        (API.getApplyCount as any).mockResolvedValue(res);

        const expectActions: any = [{
            type: ACTION_TYPE.GET_MARKET_API_APPLY_INFO,
            payload: res.data
        }]

        const store = mockStore(0);
        await dashBoardActions.getApprovedMsgCount({ status: 0 })(store.dispatch);
        const newtActions = store.getActions();
        expect(newtActions).toEqual(expectActions);
    })
    test('getUserCallTopN action', async () => {
        const res: any = {
            code: 1,
            data: [{ userId: 1, userName: 'admin@dtstack.com', callNum: 22 }]
        };
        const date = '2020-10-11';
        (API.getUserCallTopN as any).mockResolvedValue(res);

        const expectActions: any = [{
            type: ACTION_TYPE.GET_MARKET_API_CALL_RANK,
            payload: res.data,
            date: date
        }]

        const store = mockStore([]);
        await dashBoardActions.getUserCallTopN({ time: '1', topn: 10 }, true, date)(store.dispatch);
        const newtActions = store.getActions();
        expect(newtActions).toEqual(expectActions);
    })
    test('getApiCallFailRateTopN action', async () => {
        const res: any = {
            code: 1,
            data: [{ id: 1, apiName: 'api_1', callNum: 10, failRate: 100 }]
        };
        const date = '2020-10-11';
        (API.listApiCallFailRateTopNForManager as any).mockResolvedValue(res);

        const expectActions: any = [{
            type: ACTION_TYPE.GET_MARKET_API_FAIL_RANK,
            payload: res.data,
            date: date
        }]

        const store = mockStore([]);
        await dashBoardActions.getApiCallFailRateTopN({ time: '1', topn: 10 }, true, date)(store.dispatch);
        const newtActions = store.getActions();
        expect(newtActions).toEqual(expectActions);
    })
    test('getApiSubscribe action', async () => {
        const res: any = {
            code: 1,
            data: [{ id: 1, apiName: 'api_1', callNum: 22, failRate: 10 }]
        };
        const date = '2020-10-11';
        (API.getApiSubscribe as any).mockResolvedValue(res);

        const expectActions: any = [{
            type: ACTION_TYPE.GET_USER_API_SUB_INFO,
            payload: res.data,
            date: date
        }]

        const store = mockStore([]);
        await dashBoardActions.getApiSubscribe(date)(store.dispatch);
        const newtActions = store.getActions();
        expect(newtActions).toEqual(expectActions);
    })
    test('getApiCallNumTopN action', async () => {
        const res: any = {
            code: 1,
            data: [{ id: 1, apiName: 'api_01', callNum: 22, failRate: 5 }]
        };
        const date = '2020-10-11';
        (API.getApiCallNumTopN as any).mockResolvedValue(res);

        const expectActions: any = [{
            type: ACTION_TYPE.GET_USER_API_CALL_RANK,
            payload: res.data,
            date: date
        }]

        const store = mockStore([]);
        await dashBoardActions.getApiCallNumTopN({ topn: 10, time: '1' }, date)(store.dispatch);
        const newtActions = store.getActions();
        expect(newtActions).toEqual(expectActions);
    })
    test('getApiCallErrorInfo action', async () => {
        const res: any = {
            code: 1,
            data: {
                totalNum: 1,
                recordInfoList: [{ type: 5, callNum: 0, rate: 0 }]
            }
        };
        const date = '2020-10-11';
        (API.getApiCallErrorInfoForManager as any).mockResolvedValue(res);

        const expectActions: any = [{
            type: ACTION_TYPE.GET_MARKET_API_ERROR_INFO,
            payload: (res.data && res.data.recordInfoList) || [],
            date: date
        }]

        const store = mockStore([]);
        await dashBoardActions.getApiCallErrorInfo(date)(store.dispatch);
        const newtActions = store.getActions();
        expect(newtActions).toEqual(expectActions);
    })
    test('listApiCallNumTopNForManager action', async () => {
        const res: any = {
            code: 1,
            data: [{ id: 1, apiName: 'aaa', callNum: 11, failRate: 20 }]
        };
        const param = { topn: 10, time: '1' };
        (API.listApiCallNumTopNForManager as any).mockResolvedValue(res);

        const expectActions: any = [{
            type: ACTION_TYPE.GET_MARKET_TOP_CALL_FUNC,
            payload: res.data || [],
            date: param.time
        }]

        const store = mockStore([]);
        await dashBoardActions.listApiCallNumTopNForManager(param)(store.dispatch);
        const newtActions = store.getActions();
        expect(newtActions).toEqual(expectActions);
    })
})
