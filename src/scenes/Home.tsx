import {Layout, Menu} from 'antd';
import React, {ReactNode, useState} from 'react';
import {
    CalendarOutlined,
    HomeOutlined,
    NotificationOutlined,
    TrophyOutlined,
    UnorderedListOutlined,
    UserOutlined
} from "@ant-design/icons";
import { matchPath, RouteComponentProps, withRouter} from "react-router-dom";

interface ApplicationTab {
    title: string;
    key: string;
    path: string;
    exact?: boolean;
    icon: ReactNode;
    content: ReactNode;
}

const Home = ({ location, history }: RouteComponentProps) => {
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const onCollapse = (collapsed: boolean) => setMenuCollapsed(collapsed);

    const headerStyle = { height: "50px", color: "white", }

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
            content: <h2>Calendar</h2>,
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
                <div style={{ textAlign: "center", ...headerStyle }}>Hype Logo Here</div>
                <Menu
                    theme="dark"
                    mode="vertical"
                    selectedKeys={selectedTab ? [ selectedTab.key ] : []}
                    onSelect={({ key }) => selectMenuItem(key)}
                    style={{ position: "absolute", width: "100%", }}
                >
                    {tabs.map(tab => <Menu.Item key={tab.key} icon={tab.icon}>{tab.title}</Menu.Item>)}
                </Menu>
            </Layout.Sider>
            <Layout>
                <Layout.Header style={{ padding: 0, textAlign: "center", ...headerStyle }}>
                    {selectedTab && selectedTab.title}
                </Layout.Header>
                <Layout.Content>
                    <div style={{ textAlign: "center", }}>
                        {selectedTab && selectedTab.content}
                    </div>
                </Layout.Content>
                <Layout.Footer style={{ textAlign: "center" }}>HYPE - Hope for Youth Program</Layout.Footer>
            </Layout>
        </Layout>
    )
}

export default withRouter(Home);