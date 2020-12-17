import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Input, Button, message } from 'antd';
import { approvalActions } from '../../actions/approval';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

const formLayout: any = {
    labelCol: {
        sm: 5, xs: 24
    },
    wrapperCol: {
        sm: 17, xs: 24
    }
}

const mapDispatchToProps = (dispatch: any) => ({
    handleApply (params: any) {
        return dispatch(approvalActions.handleApply(params));
    }
});

@(connect(null, mapDispatchToProps) as any)
class BatchApprovalModal extends React.Component<any, any> {
    componentDidUpdate (preProps: any) {
        const { visible } = this.props;
        if (visible && visible !== preProps.visible) {
            this.props.form.setFieldsValue({
                desc: undefined
            })
        }
    }
    handleApproval = (isPass: boolean) => {
        const { approvalList } = this.props;
        this.props.form.validateFields(
            (err: any, values: any) => {
                if (!err) {
                    const approvalContent = values.desc;
                    this.props.handleApply({
                        handleList: approvalList.map(item => item.id),
                        isPassed: isPass,
                        approvalContent: approvalContent
                    }).then((res: any) => {
                        if (res.code == 1) {
                            message.success('审批成功');
                            this.props.onOk();
                        }
                    })
                }
            }
        )
    }
    getModalFooter () {
        return (
            <div>
                <Button type="danger" data-testid="reject_btn" onClick={this.handleApproval.bind(this, false)}>拒绝</Button>
                <Button type="primary" data-testid="agree_btn" onClick={this.handleApproval.bind(this, true)}>同意</Button>
            </div>
        )
    }
    render () {
        const { visible, approvalList = [], onCancel } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                title={'批量审批'}
                visible={visible}
                onCancel={onCancel}
                footer={this.getModalFooter()}
            >
                <Form data-testid="batch_approval_form">
                    <FormItem
                        {...formLayout}
                        label="API数量"
                        data-testid="api_count"
                    >
                        {approvalList.length}
                    </FormItem>
                    <FormItem
                        {...formLayout}
                        label="申请人"
                        data-testid="apply_user_name"
                    >
                        {approvalList.reduce((pre: any, curr: any, index: number) => {
                            return index ? pre + ';' + curr.applyUserName : curr.applyUserName;
                        }, '')}
                    </FormItem>
                    <FormItem
                        {...formLayout}
                        label="审批说明"
                    >
                        {getFieldDecorator('desc', {
                            rules: [
                                { required: true, message: '请填写审批说明' },
                                { max: 200, message: '最大字数不能超过200' }
                            ]
                        })(<TextArea data-testid="reply_content" style={{ width: '100%' }} rows={4} />)
                        }
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}
export default Form.create<any>()(BatchApprovalModal);
