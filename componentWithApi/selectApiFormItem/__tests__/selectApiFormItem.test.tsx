import * as React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react'
import SelectApiFormItem from '../selectApiFormItem';
import API from '../../../../../api/alarm';
jest.mock('../../../../../api/alarm')

let wrapper;
const responseData = {
    totalCount: 3,
    data: [
        { id: 229, name: '12321', cnName: '', createUserName: 'admin@dtstack.com', apiType: 0 },
        { id: 157, name: '21321321', cnName: '', createUserName: 'admin@dtstack.com', apiType: 0 },
        { id: 145, name: '234', cnName: '', createUserName: 'admin@dtstack.com', apiType: 0 }
    ]
};
describe('notDisturbTimeFormItem Component test', () => {
    beforeEach(() => {
        let value: any;
        let onChange = (val: any) => {
            value = val;
        };
        (API.getApiListByQueryName as any).mockResolvedValue({
            success: true,
            code: 1,
            data: { ...responseData }
        })
        wrapper = render(<SelectApiFormItem value={value} onChange={onChange}/>)
    })
    afterEach(() => {
        cleanup()
    })
    test('should render correct', () => {
        const { container } = wrapper;
        const apiSelector = container.querySelector('.ant-select');
        fireEvent.click(apiSelector);
        const selectLi = document.getElementsByClassName('ant-select-dropdown-menu-item');
        expect(selectLi.length).toEqual(responseData.totalCount);
        console.log(document.querySelector('.ant-select-dropdown-menu').innerHTML);
        fireEvent.click(selectLi[0]);

        setTimeout(() => {
            const tableRow = document.getElementsByClassName('ant-table-row');
            expect(tableRow.length).toEqual(1);
            const deleteBtn = tableRow[0].getElementsByTagName('td')[4].getElementsByTagName('a')[0];
            fireEvent.click(deleteBtn);
        })
    })
})
