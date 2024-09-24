
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from "react-router-dom"
import { useRequest } from 'ahooks'

import { Button, Checkbox, Form, Input, Card, message as Message } from 'antd';

import { login } from '@/api';
import { useStores } from "@/store"

import loginImg from "@/assets/image/image.png"

import { type FieldType, type Profile } from "@/type"
import type { FormProps } from 'antd';

const App: React.FC = () => {
    const nav = useNavigate()
    const { globalStore: { setUserInfo } } = useStores()
    const { run, loading } = useRequest(login<Profile>, {
        manual: true,
        onSuccess: ({ message, status, data: { userInfo } }) => {
            switch (status) {
                case 200:
                    Message.success('登录成功');
                    setUserInfo(userInfo)
                    nav('/');
                    break;
                case 401:
                    Message.error('账号或密码错误');
                    break;
                default:
                    Message.error(JSON.stringify(message) || '服务器忙，请稍后再试');
                    break;
            }
        },
        onError: () => {
            Message.error('请求失败，请稍后再试');
        },
    });
    const onFinish: FormProps<FieldType>['onFinish'] = async ({ username, password }) => {
        if (!username || !password) return
        run({ username, password });

    };
    return (
        <div className={`w-full h-[100vh]  flex items-center justify-between overflow-x-hidden bg-no-repeat bg-center bg-cover`} style={{ backgroundImage: `url(${loginImg})` }}>
            <Card className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] md:w-auto min-w-[300px]'>
                <Form
                    disabled={loading}
                    name="basic"
                    onFinish={onFinish}
                    autoComplete="off"
                    className='mt-[30px]'
                >
                    <Form.Item<FieldType>
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item<FieldType>
                        name="remember"
                        valuePropName="checked"
                    >
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item >
                        <Button type="primary" htmlType="submit" className=' w-full uppercase' loading={loading}>
                            login
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default observer(App);