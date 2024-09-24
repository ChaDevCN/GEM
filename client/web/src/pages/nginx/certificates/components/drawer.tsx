
import React from "react"
import { Descriptions, Drawer, message, Tag, type DescriptionsProps } from "antd"
import { ProForm, ProFormGroup, ProFormSelect, ProFormText } from "@ant-design/pro-components"
import { CopyOutlined } from "@ant-design/icons"
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Identifier } from "@/type"
import { type DrawerType, statusMap } from "../index"

interface Props {
    options: {
        open: boolean
        setOpen: React.Dispatch<React.SetStateAction<boolean>>
        loading?: boolean
        type: DrawerType,
        run: (data: any) => void;
        data?: Identifier & { status: string } | null
        closeCallback: () => void
    }

}
const title = {
    add: '证书申请',
    edit: '编辑证书',
    pending: '验证中'
}
const Index = ({ options: { open, setOpen, loading = false, type, run, data, closeCallback } }: Props) => {
    const onClose = () => {
        closeCallback && closeCallback()
        setOpen(false)
    }
    const items: DescriptionsProps['items'] = [
        {
            key: '0',
            label: '状态',
            children: <Tag color={statusMap[data?.status || 'invalid'].color}>{statusMap[data?.status || 'invalid'].text}</Tag>
        },
        {
            key: '1',
            label: '验证类型',
            children: data?.type
        },
        {
            key: '2',
            label: '主机记录',
            children: <div>
                {`_acme-challenge.${data?.value.split('.')[0]}`}
                <CopyToClipboard text={`_acme-challenge.${data?.value.split('.')[0]}` || '复制失败'} onCopy={() => message.success('复制成功')}>
                    <CopyOutlined className="ml-1" />
                </CopyToClipboard>
            </div >
        },
        {
            key: '3',
            label: '记录类型',
            children: `TXT`
        },
        {
            key: '4',
            label: '记录值',
            children: <div>
                {data?.dns}
                <CopyToClipboard text={data?.dns || '复制失败'} onCopy={() => message.success('复制成功')}>
                    <CopyOutlined className="ml-1" />
                </CopyToClipboard>
            </div>
        }
    ]
    return (
        <Drawer open={open} closable destroyOnClose onClose={onClose} title={title[type]} maskClosable={false}>
            {
                type === 'add' && <ProForm onFinish={run} disabled={loading} loading={loading}>
                    <ProFormGroup>
                        <ProFormText
                            width="md"
                            name="domain"
                            label="域名"
                            rules={[
                                { required: true, message: '请输入域名' },
                                { pattern: /^(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63})$/, message: '请输入正确的域名' }

                            ]} />
                        <ProFormText
                            width="md"
                            name="email"
                            label="邮箱"
                            rules={[
                                { required: true, message: '请输入邮箱' },
                                { type: 'email', message: '请输入正确的邮箱地址' }

                            ]} />
                        <ProFormSelect
                            label='加密类型'
                            width="md"
                            name="encryptionType"
                            options={
                                [
                                    {
                                        value: 'RSA',
                                        label: 'RSA',
                                    },
                                    {
                                        value: 'P-256',
                                        label: 'ECDSA (P-256)',
                                    },
                                    {
                                        value: 'P-384',
                                        label: 'ECDSA (P-384)',
                                    },
                                    {
                                        value: 'P-521',
                                        label: 'ECDSA (P-521)',
                                    }
                                ]
                            }
                            rules={[{ required: true, message: '请选择加密类型' }]}
                        />
                        <ProFormSelect
                            name="certificateAuthority"
                            label='证书厂商'
                            width='md'
                            options={[
                                {
                                    value: `LetsEncrypt`,
                                    label: 'Let\'s Encrypt',
                                }
                            ]}
                            rules={[{ required: true, message: '请选择证书厂商' }]}
                        />
                    </ProFormGroup>
                </ProForm>
            }
            {
                type === 'pending' && <Descriptions items={items} layout="vertical" bordered column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }} />
            }
        </Drawer>
    )
}
export default Index