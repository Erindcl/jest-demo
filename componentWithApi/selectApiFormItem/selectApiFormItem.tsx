import * as React from 'react';
import { Select, Form, Table, Tooltip, message, Spin, Empty } from 'antd'
import EllipsisText from '../../../../components/ellipsisText';
import API from '../../../../api/alarm';
import { debounce, isEqual } from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';

const formItemLayout: any = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 }
    }
};
const FormItem = Form.Item;
const Option = Select.Option;
interface IProps {
    onChange?: any;
    value?: any;
}
interface IState {
    selectItems: any[];
    selectApiIds: any[];
    apiOptions: any[];
    apiListFilter: any;
    fetching: boolean;
    scrollListLoad: boolean;
    apiTotalCount: number;
}
export default class SelectApiFormItem extends React.Component<IProps, IState> {
    state: IState = {
        selectItems: [],
        apiOptions: [],
        apiListFilter: {
            name: undefined,
            currentPage: 1,
            pageSize: 100
        },
        apiTotalCount: 0,
        fetching: true,
        scrollListLoad: false,
        selectApiIds: []
    }

    debounceFetchAPIList: any = null;

    componentDidMount () {
        this.debounceFetchAPIList = debounce(this.handleSearchApi, 500);
        this.handleFetchAPIList(this.initSelectApis);
    }

    componentDidUpdate (preProps) {
        const { value } = this.props;
        if (!isEqual(value, preProps.value)) {
            this.initSelectApis();
        }
    }

    initSelectApis = () => {
        const { value } = this.props;
        const { apiOptions } = this.state;
        const selectApiIds = Array.isArray(value) ? value.reduce((pre: any, ele: any) => {
            return [...pre, ele.id];
        }, []) : [];
        const newApiOptions = apiOptions.map((ele: any) => { return { ...ele, disabled: selectApiIds.includes(ele.id) } });
        this.setState({
            selectItems: value ? [...value] : [],
            selectApiIds,
            apiOptions: [...newApiOptions]
        })
    }

    handleCancelSelect = (record: any, index: number) => {
        const { selectItems } = this.state;
        selectItems.splice(index, 1);
        this.props.onChange([...selectItems]);
    }

    handleSelect = (value: any) => {
        const { selectItems, apiOptions } = this.state;
        let newSI = [];
        if (selectItems.length === 100) {
            message.warning('最多只可选择100个API');
            return false;
        }
        apiOptions[value].disabled = true;
        newSI = [
            ...selectItems,
            { ...apiOptions[value] }
        ];
        const selectApiIds = newSI.reduce((pre: any, ele: any) => {
            return [...pre, ele.id];
        }, []);
        this.props.onChange(newSI);
        // 选择后 更新下拉列表
        this.setState({
            fetching: true,
            apiListFilter: {
                name: undefined,
                currentPage: 1,
                pageSize: 100
            },
            selectApiIds
        }, () => {
            this.handleFetchAPIList();
        })
    }

    handleFetchAPIList = (callback?: any) => {
        const { apiListFilter, apiOptions, fetching, selectApiIds } = this.state;
        API.getApiListByQueryName({
            ...apiListFilter
        }).then((res: any) => {
            const { code, data } = res;
            if (code == 1) {
                const newData = Array.isArray(data.data) ? data.data.map((ele: any) => { return { ...ele, disabled: selectApiIds.includes(ele.id) } }) : [];
                const newApiOptions = fetching ? newData : [...apiOptions, ...newData];
                this.setState({
                    apiOptions: newApiOptions,
                    apiTotalCount: data.totalCount || 0,
                    scrollListLoad: false,
                    fetching: false
                }, () => {
                    callback && callback();
                })
            } else {
                this.setState({
                    scrollListLoad: false,
                    fetching: false
                })
                message.error(res.message);
            }
        })
    }

    handleSearchApi = (value: any) => {
        const { apiListFilter } = this.state;
        this.setState({
            apiListFilter: {
                ...apiListFilter,
                name: value,
                currentPage: 1
            },
            fetching: true
        }, this.handleFetchAPIList)
    }

    handleLoadMoreAPIList = () => {
        const { apiListFilter } = this.state;
        this.setState({
            apiListFilter: {
                ...apiListFilter,
                currentPage: apiListFilter.currentPage + 1
            },
            scrollListLoad: true
        }, this.handleFetchAPIList)
    }

    initColumns () {
        const columns: any = [{
            title: 'API名称',
            dataIndex: 'name',
            key: 'name',
            width: '200px',
            render: (text: any, record: any) => {
                return <EllipsisText placement="topLeft" style={{ width: 160 }} value={text || ''} />;
            }
        }, {
            title: 'API中文名称',
            dataIndex: 'cnName',
            key: 'cnName',
            width: '200px',
            render: (text: any, record: any) => {
                return <EllipsisText placement="topLeft" style={{ width: 160 }} value={text || ''} />;
            }
        }, {
            title: 'API类型',
            dataIndex: 'apiType',
            key: 'apiType',
            width: '150px',
            render: (text: any, record: any) => {
                return text === 0 ? '生成API' : '注册API';
            }
        }, {
            title: '创建人',
            dataIndex: 'createUserName',
            key: 'createUserName',
            width: '200px',
            render: (text: any, record: any) => {
                return <EllipsisText placement="topLeft" style={{ width: 160 }} value={text || ''} />;
            }
        }, {
            title: '操作',
            dataIndex: 'deal',
            key: 'deal',
            width: '150px',
            render: (text: any, record: any, index: any) => {
                return <a onClick={this.handleCancelSelect.bind(this, record, index)}>删除</a>
            }
        }];
        return columns;
    }

    render () {
        const { selectItems, apiOptions, fetching, scrollListLoad, apiTotalCount } = this.state;
        return (
            <div className="select-api-form-item">
                <FormItem label="选择API" required {...formItemLayout}>
                    <Select
                        onSelect={this.handleSelect}
                        value={undefined}
                        filterOption={false}
                        style={{ width: 420 }}
                        showSearch={true}
                        onSearch={this.debounceFetchAPIList}
                        notFoundContent={fetching ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                        dropdownRender={menu => (
                            <div className="load-more-options-box">
                                <InfiniteScroll
                                    pageStart={0}
                                    loadMore={this.handleLoadMoreAPIList}
                                    hasMore={!scrollListLoad && apiOptions.length < apiTotalCount}
                                    useWindow={false}
                                    initialLoad={false}
                                >
                                    {menu}
                                </InfiniteScroll>
                                {scrollListLoad && <div
                                    style={{ padding: '5px 12px', color: '#3F87FF' }}
                                    onMouseDown={e => e.preventDefault()}
                                >
                                    <Spin size="small" />
                                </div>}
                            </div>
                        )}
                    >
                        {apiOptions.map((item: any, index: number) => {
                            let tooltipTitle = `${item.name} ${item.cnName}`
                            return (<Option disabled={item.disabled || false} key={index} value={index}>
                                <Tooltip placement="topLeft" title={tooltipTitle}>
                                    <span>{item.name}</span>
                                    <span>&nbsp;&nbsp;</span>
                                    <span style={{ color: '#BFBFBF' }}>{item.cnName}</span>
                                </Tooltip>
                            </Option>
                            );
                        })}
                    </Select>
                </FormItem>
                <Table
                    size="middle"
                    style={{ width: '100%' }}
                    columns={this.initColumns()}
                    dataSource={selectItems}
                    pagination={false}
                    scroll={{ y: 230 }}
                    className="dt-pagination-lower dt-table-border dt-table-empty-noborder dt-table-last-row-noborder"
                />
            </div>
        )
    }
}
