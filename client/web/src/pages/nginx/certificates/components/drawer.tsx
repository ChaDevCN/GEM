
import React from "react"
import { Drawer } from "antd"
import { ProForm, ProFormGroup, ProFormSelect, ProFormText } from "@ant-design/pro-components"

interface Props {
    options: {
        open: boolean
        setOpen: React.Dispatch<React.SetStateAction<boolean>>
        loading?: boolean
        type: 'add' | 'edit',
        run: (data: any) => void;
    }

}
const title = {
    add: '证书申请',
    edit: '编辑证书',
}
const Index = ({ options: { open, setOpen, loading = false, type, run } }: Props) => {

    return (
        <Drawer open={open} closable destroyOnClose onClose={() => setOpen(false)} title={title[type]}>
            <ProForm onFinish={run} disabled={loading} loading={loading}>
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
        </Drawer>
    )
}
export default Index