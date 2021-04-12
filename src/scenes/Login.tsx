import React from 'react';
import {Button, Col, Form, Input, Row, Typography} from "antd";
import {useAppDispatch} from "../redux/store";
import {login} from "../redux/userSlice";

const Login = () => {
    const dispatch = useAppDispatch();

    const onFinish = (values: { username: string, password: string }) => {
        dispatch(login(values));
    }

    return (
        <Row align="middle" justify="center" style={{ minHeight: "100vh" }}>
            <Col>
                <Form onFinish={onFinish}>
                    <Typography.Title level={2}>HYPE Login</Typography.Title>
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
                            Log In
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
}

export default Login