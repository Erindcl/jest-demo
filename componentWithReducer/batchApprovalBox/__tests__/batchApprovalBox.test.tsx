import * as React from 'react'
import { render, cleanup } from '@testing-library/react'
import BatchApprovalModal from '../index';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from '../../../reducers'

afterEach(cleanup)

function renderWithRedux (Component, rootReducer, initialState: any = {}) {
    const store: any = createStore(rootReducer, initialState);
    return {
        ...render(<Provider store={store}>
            { Component }
        </Provider>),
        store
    }
}

describe('batchApprovalModal Component test', () => {
    test('batch approval api', () => {
        let visible = true;
        let onCancel = () => {
            visible = false;
        };
        const expectData = [
            { applyUserName: 'admin1', id: 1 },
            { applyUserName: 'admin2', id: 1 },
            { applyUserName: 'admin3', id: 1 }
        ];

        const { getByTestId } = renderWithRedux(<BatchApprovalModal visible={visible} approvalList={expectData} onCancel={onCancel} />, reducer);
        const rejectBtn = getByTestId('reject_btn');
        expect(rejectBtn.getElementsByTagName('span')[0].innerHTML).toEqual('拒 绝');
        expect(rejectBtn.getAttribute('class')).toEqual('ant-btn ant-btn-danger');
        expect(rejectBtn.getAttribute('type')).toEqual('button');

        const agreeBtn = getByTestId('agree_btn');
        expect(agreeBtn.getElementsByTagName('span')[0].innerHTML).toEqual('同 意');
        expect(agreeBtn.getAttribute('class')).toEqual('ant-btn ant-btn-primary');

        const approvalForm = getByTestId('batch_approval_form');
        expect(approvalForm.childNodes.length).toBe(3);

        const apiName = getByTestId('api_count');
        expect(apiName.querySelector('.ant-form-item-children').innerHTML).toEqual(expectData.length + '');

        const applyUserName = getByTestId('apply_user_name');
        const applyUsrNameString = expectData.reduce((pre: any, curr: any, index: number) => {
            return index ? pre + ';' + curr.applyUserName : curr.applyUserName;
        }, '');
        expect(applyUserName.querySelector('.ant-form-item-children').innerHTML).toEqual(applyUsrNameString);

        const applyContent = getByTestId('reply_content');
        expect(applyContent).not.toBeNull();
    })
});
