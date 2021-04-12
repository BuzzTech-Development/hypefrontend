import {Calendar, Layout, Menu, Typography} from 'antd';
import React, {ReactNode, useState} from 'react';
import {
    CalendarOutlined,
    HomeOutlined,
    LogoutOutlined,
    NotificationOutlined,
    TrophyOutlined,
    UnorderedListOutlined,
    UserOutlined
} from "@ant-design/icons";
import { matchPath, RouteComponentProps, withRouter} from "react-router-dom";
import {useAppDispatch} from "../redux/store";
import { logout } from '../redux/userSlice';

interface ApplicationTab {
    title: string;
    key: string;
    path: string;
    exact?: boolean;
    icon: ReactNode;
    content: ReactNode;
}

const Home = ({ location, history }: RouteComponentProps) => {
    const dispatch = useAppDispatch();

    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const onCollapse = (collapsed: boolean) => setMenuCollapsed(collapsed);

    const headerHeight = "60px";
    const headerStyle = { height: headerHeight, color: "white", }

    const tabs: ApplicationTab[] = [
        {
            title: "Home",
            key: "home",
            path: "/",
            exact: true,
            icon: <HomeOutlined />,
            content: <h2>Home</h2>,
        },
        {
            title: "Announcements",
            key: "announcements",
            path: "/announcements",
            icon: <NotificationOutlined />,
            content: <h2>Announcements</h2>,
        },
        {
            title: "Calendar",
            key: "calendar",
            path: "/calendar",
            icon: <CalendarOutlined />,
            content: <Calendar />,
        },
        {
            title: "Assignments",
            key: "assignments",
            path: "/assignments",
            icon: <UnorderedListOutlined />,
            content: <h2>Assignments</h2>,
        },
        {
            title: "Progress",
            key: "progress",
            path: "/progress",
            icon: <TrophyOutlined />,
            content: <h2>Progress</h2>,
        },
        {
            title: "Account",
            key: "account",
            path: "/account",
            icon: <UserOutlined />,
            content: <h2>Account</h2>,
        }
    ]

    const selectedTab = tabs.find(
        tab => matchPath(location.pathname, { path: tab.path, exact: tab.exact || false })
    );

    const selectMenuItem = (key: string | number) => {
        const selected = tabs.find(tab => tab.key === key);
        if (selected) {
            history.push(selected.path);
        }
    }

    return (
        <Layout style={{ minHeight: "100vh", }}>
            <Layout.Sider collapsible collapsed={menuCollapsed} onCollapse={onCollapse} style={{ height: "100vh" }}>
                <div style={{ textAlign: "center", ...headerStyle }}>
                    <img src={"./hype-logo.svg"} />
                </div>
                <Menu
                    theme="dark"
                    mode="vertical"
                    selectedKeys={selectedTab ? [ selectedTab.key ] : []}
                    onSelect={({ key }) => selectMenuItem(key)}
                    style={{ position: "absolute", width: "100%", }}
                >
                    {tabs.map(tab => <Menu.Item key={tab.key} icon={tab.icon}>{tab.title}</Menu.Item>)}
                    <Menu.Item
                        icon={<LogoutOutlined />}
                        danger
                        onClick={() => dispatch(logout())}
                    >
                        Log Out
                    </Menu.Item>
                </Menu>
            </Layout.Sider>
            <Layout>
                <Layout.Header style={{ padding: 0, textAlign: "center", ...headerStyle }}>
                    <Typography.Title level={3} style={{ color: "white", lineHeight: headerHeight, }}>
                        {selectedTab && selectedTab.title}
                    </Typography.Title>
                </Layout.Header>
                <Layout.Content>
                    <div style={{ textAlign: "center", margin: "20px", }}>
                        {selectedTab && selectedTab.content}
                    </div>
                </Layout.Content>
                <Layout.Footer style={{ textAlign: "center" }}>HYPE - Hope for Youth Program</Layout.Footer>
            </Layout>
        </Layout>
    )
}

export default withRouter(Home);