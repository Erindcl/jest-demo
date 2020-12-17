import * as React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react'
import CallCountInput from '../index';

describe('callCountInput Component test', () => {
    afterEach(() => {
        cleanup()
    })
    test('should render correct', () => {
        let value: any;
        let onChange = (val: any) => {
            value = val;
        };
        const { container } = render(
            <CallCountInput disabled={false} value={value} onChange={onChange} />
        );

        const inputNumberForm = container.querySelector('.ant-input-number-input');
        expect(inputNumberForm).not.toBeNull();
        fireEvent.change(inputNumberForm, {
            target: { value: 1 }
        });

        const checkboxForm = container.querySelector('.ant-checkbox-wrapper');
        expect(checkboxForm).not.toBeNull();
        fireEvent.click(checkboxForm);
    })
})
