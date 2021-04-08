import React from 'react';
import {Button, Form, Input} from "antd";
import {useDispatch} from "react-redux";
import {useAppDispatch} from "../redux/store";
import {login} from "../redux/userSlice";

const Login = () => {
    const dispatch = useAppDispatch();

    const onFinish = (values: { username: string, password: string }) => {
        dispatch(login(values));
    }

    return (
        <Form onFinish={onFinish}>
            <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
}

export default Login