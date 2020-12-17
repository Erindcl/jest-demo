import * as React from 'react'
import { render, cleanup, fireEvent, waitFor } from '@testing-library/react'
import LogModal from '../logModal';
import API from '../../../../api/apiManage';
jest.mock('../../../../api/apiManage')

const responseData = 'This is a log.';
// to fix Error: range.getBoundingClientRect is not a function
document.createRange = () => {
    const range = new Range();
    range.getBoundingClientRect = jest.fn();
    range.getClientRects = () => {
        return {
            item: () => null,
            length: 0,
            [Symbol.iterator]: jest.fn()
        };
    };
    return range;
}
describe('logModal Component test', () => {
    afterEach(() => {
        cleanup()
    })
    test('should render correct', async () => {
        let visible = true;
        let onCancel = () => {
            visible = false;
        };
        let apiInfor = {
            id: 1
        };
        (API.getApiImportLog as any).mockResolvedValue({
            success: true,
            code: 1,
            data: responseData
        })
        const { getByText } = render(<LogModal visible={visible} onCancel={onCancel} apiInfor={apiInfor}/>);
        const logDataEle = await waitFor(() => getByText(responseData));
        expect(logDataEle).not.toBeNull();

        const closeBtn = document.querySelector('.ant-modal-close');
        expect(closeBtn).not.toBeNull();
        fireEvent.click(closeBtn);
    })
})
