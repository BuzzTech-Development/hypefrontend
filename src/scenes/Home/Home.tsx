import React, {ReactNode, useState} from 'react';
import { matchPath, RouteComponentProps, withRouter} from "react-router-dom";

import {Layout, Menu} from 'antd';
import {
    CalendarOutlined,
    HomeOutlined,
    LogoutOutlined,
    NotificationOutlined,
    TrophyOutlined,
    UnorderedListOutlined,
    UserOutlined
} from "@ant-design/icons";

import { useAppDispatch } from 'redux/store';
import { logout } from 'redux/userSlice';

import Calendar from './scenes/Calendar';
import styles from './Home.module.css';

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
        <Layout className={styles.Home}>
            <Layout.Sider theme="dark" collapsible collapsed={menuCollapsed} onCollapse={onCollapse} className={styles.Sider}>
                <div className={styles.Header}>
                    <img src="./hype-logo.svg" className={styles.Logo} />
                </div>
                <Menu
                    theme="dark"
                    mode="vertical"
                    selectedKeys={selectedTab ? [ selectedTab.key ] : []}
                    onSelect={({ key }) => selectMenuItem(key)}
                    className={styles.Menu}
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
                <Layout.Header className={styles.Header}>
                    <span className={styles.Title}>
                        {selectedTab && selectedTab.title}
                    </span>
                </Layout.Header>
                <Layout.Content className={styles.Content}>
                    {selectedTab && selectedTab.content}
                </Layout.Content>
                <Layout.Footer className={styles.Footer}>HYPE - Hope for Youth Program</Layout.Footer>
            </Layout>
        </Layout>
    )
}

export default withRouter(Home);