import * as React from 'react';
import { Checkbox, Dropdown, Divider } from 'antd';
import { isEqual } from 'lodash';
import './styles.scss';

interface IProps {
    popupContainer?: any;
    onChange?: any;
    options: any[];
    value: any[];
    onOk: any;
    renderNode: Function;
}

interface IState {
    visible: boolean;
    selectVal: any[];
    allKeys: any[];
    disabledKeys: any[];
    indeterminate: boolean;
}

export default class MulSelectDropdown extends React.Component<IProps, IState> {
    state: IState = {
        visible: false,
        selectVal: [],
        allKeys: [],
        indeterminate: false,
        disabledKeys: []
    }

    componentDidMount () {
        const { options, value } = this.props;
        const allKeys = [];
        const disabledKeys = [];
        options.forEach((item: any) => {
            allKeys.push(item.value);
            item.disabled && disabledKeys.push(item.value);
        })
        this.setState({
            allKeys,
            disabledKeys
        }, () => {
            this.handleCheckboxChange(value);
        })
    }

    componentDidUpdate (preProps) {
        const { value } = this.props;
        if (!isEqual(value, preProps.value)) {
            this.handleCheckboxChange(value);
        }
    }

    handleCheckboxChange = (checkedValue: any) => {
        const { allKeys } = this.state;
        this.setState({
            selectVal: checkedValue,
            indeterminate: Boolean(checkedValue.length && checkedValue.length !== allKeys.length)
        })
        this.props.onChange && this.props.onChange(checkedValue);
    }

    handleCheckAllChange = () => {
        const { allKeys, selectVal, disabledKeys } = this.state;
        const newSelectVal = selectVal.length === allKeys.length ? disabledKeys : [...allKeys];
        this.setState({
            selectVal: newSelectVal,
            indeterminate: false
        })
        this.props.onChange && this.props.onChange(newSelectVal);
    }

    handleCancel = () => {
        this.setState({
            visible: false
        })
    }

    handleOk = () => {
        const { selectVal } = this.state;
        this.handleCancel();
        this.props.onOk(selectVal);
    }

    handleOpen = () => {
        this.setState({
            visible: true
        })
    }

    render () {
        const {
            popupContainer = () => document.body,
            options = [],
            renderNode = (openFun) => (<span onClick={openFun}>打开</span>)
        } = this.props;
        const { visible, selectVal, indeterminate, allKeys } = this.state;
        const overlay = (
            <div className="dtc-option-select-overlay">
                <Checkbox.Group onChange={this.handleCheckboxChange} value={selectVal}>
                    <div className='dtc-option-select-overlay-menu'>
                        {options.map(item => <div className="dtc-option-select-overlay-row" key={item.value}>
                            <Checkbox disabled={item.disabled} value={item.value} >{item.label}</Checkbox>
                        </div>)}
                    </div>
                </Checkbox.Group>
                <Divider />
                <div className="dtc-option-select-overlay-row footer-box">
                    <Checkbox
                        onChange={this.handleCheckAllChange}
                        checked={selectVal.length === allKeys.length}
                        indeterminate={indeterminate}
                    >全选</Checkbox>
                    <span>
                        <a style={{ marginRight: 8, color: '#666666' }} data-testid="select_cancel_btn" onClick={this.handleCancel}>关闭</a>
                        <a onClick={this.handleOk}>确定</a>
                    </span>
                </div>
            </div>
        );
        return (
            <Dropdown
                visible={visible}
                trigger={['click']}
                overlay={overlay}
                overlayClassName="dtc-mul-select-dropdown"
                getPopupContainer={popupContainer}
                onVisibleChange={(visible) => { !visible && this.handleCancel() }}
            >
                {renderNode(this.handleOpen)}
            </Dropdown>
        )
    }
}
