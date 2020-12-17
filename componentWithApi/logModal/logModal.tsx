import * as React from 'react';
import { Modal, Spin } from 'antd';
import Editor from 'dt-common/src/widgets/code-editor';
import API from '../../../api/apiManage';

const editorOptions: any = {
    mode: 'text',
    lineNumbers: true,
    readOnly: true,
    autofocus: false,
    indentWithTabs: true,
    lineWrapping: true,
    smartIndent: true,
    autoRefresh: true
};

class RunningLogModal extends React.Component<any, any> {
    $editor: any;
    state: any = {
        logData: '', // log数据
        spinning: false
    }
    componentDidMount () {
        this.fetchData();
    }
    componentDidUpdate (prevProps: any) {
        if (this.props.visible && prevProps.visible !== this.props.visible) {
            this.fetchData();
        }
    }

    fetchData = async () => {
        const { apiInfor } = this.props;
        if (!apiInfor || !apiInfor.id) {
            return false;
        }
        this.setState({
            spinning: true
        });
        const res = await API.getApiImportLog({ apiId: apiInfor.id });
        if (res.code === 1) {
            this.setState({
                logData: res.data
            })
        }
        this.setState({
            spinning: false
        });
        this.editorRefresh();
    }
    editorRefresh () {
        if (!this.$editor) {
            return;
        }
        window.setTimeout(() => {
            this.$editor.refresh();
        }, 300);
    }
    editorRef = (editor: any) => {
        this.$editor = editor;
    }

    render () {
        const { visible, onCancel, apiInfor } = this.props;
        const { logData } = this.state;
        return (
            <Modal
                width={680}
                title="查看日志"
                wrapClassName="import-log-modal"
                visible={visible}
                onCancel={onCancel}
                footer={null}
                maskClosable={true}
                bodyStyle={{
                    padding: '0 0 0 0',
                    position: 'relative'
                }}
            >
                <Spin spinning={this.state.spinning}>
                    <div style={{ height: 450 }}>
                        <Editor style={{ height: '100%' }} editorRef={ this.editorRef } key={apiInfor && apiInfor.id} sync value={logData} options={editorOptions} />
                    </div>
                </Spin>
            </Modal>
        )
    }
}

export default RunningLogModal;
