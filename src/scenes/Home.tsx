import {Layout, Menu} from 'antd';
import React, {useState} from 'react';
import {CalendarOutlined, HomeOutlined} from "@ant-design/icons";

const Home = () => {
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const onCollapse = (collapsed: boolean) => setMenuCollapsed(collapsed);

    const headerStyle = { height: "50px", color: "white", }

    return (
        <Layout style={{ minHeight: "100vh", }}>
            <Layout.Sider collapsible collapsed={menuCollapsed} onCollapse={onCollapse}>
                <div style={{ textAlign: "center", ...headerStyle }}>Hype Logo Here</div>
                <Menu
                    theme="dark"
                    mode="vertical"
                    style={{ height: "100vh", position: "absolute", width: "100%", }}
                >
                    <Menu.Item icon={<HomeOutlined />}>Home</Menu.Item>
                    <Menu.Item icon={<CalendarOutlined />}>Calendar</Menu.Item>
                </Menu>
            </Layout.Sider>
            <Layout>
                <Layout.Header style={{ padding: 0, textAlign: "center", ...headerStyle }}>
                    Header Title
                </Layout.Header>
                <Layout.Content>

                </Layout.Content>
                <Layout.Footer style={{ textAlign: "center" }}>HYPE</Layout.Footer>
            </Layout>
        </Layout>
    )
}

export default Home;