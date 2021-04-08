import React from 'react';
import {Button, Form, Input} from "antd";

const Login = () => {
    return (
        <Form>
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