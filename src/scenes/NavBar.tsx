import React, {ReactNode, useState} from 'react';
import { matchPath, RouteComponentProps, withRouter} from "react-router-dom";
import { Layout, Menu, Select } from 'antd';
import {logout, selectCohort} from 'redux/userSlice';
import {
    CalendarOutlined, FormOutlined,
    HomeOutlined,
    LogoutOutlined,
    NotificationOutlined,
    TeamOutlined,
    TrophyOutlined,
    UnorderedListOutlined,
    UserOutlined
} from "@ant-design/icons";
import { useAppSelector, useAppDispatch } from 'redux/store';
import styles from './Home.module.css';
import Students from './Students';
import {UserRole} from 'redux/userSlice';

interface ApplicationTab {
    title: string;
    key: string;
    path: string;
    exact?: boolean;
    icon: ReactNode;
}

const NavBar = (props: any) => {
    const role = useAppSelector((state) => state.user.userDetail?.profile?.role);
    const dispatch = useAppDispatch();
    const cohorts = useAppSelector(state => state.user.userDetail?.profile?.cohorts || []);
    const currentCohort = useAppSelector(state => state.user.currentCohort);
    const onSelectCohort = (cohortId: number) => dispatch(selectCohort(cohortId));
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const onCollapse = (collapsed: boolean) => setMenuCollapsed(collapsed);
    const user = props.user;

    var tabs: ApplicationTab[] = [
        {
            title: "Home",
            key: "home",
            path: "/",
            exact: true,
            icon: <HomeOutlined />
        },
        {
            title: "Announcements",
            key: "announcements",
            path: "/announcements",
            icon: <NotificationOutlined />
        },
        {
            title: "Calendar",
            key: "calendar",
            path: "/calendar",
            icon: <CalendarOutlined />,
        },
        {
            title: "Assignments",
            key: "assignments",
            path: "/assignments",
            icon: <UnorderedListOutlined />
        },
        // view students only if instructor
        ...role === "INSTRUCTOR" || role === "ADMIN" ? [{
            title: "Students",
            key: "students",
            path: "/students",
            icon: <TeamOutlined />
        }] : [
            {
                title: "Grades",
                key: "grades",
                path: "/grades",
                icon: <FormOutlined />
            },
        ],

        {
            title: "Account",
            key: "account",
            path: "/account",
            icon: <UserOutlined />
        }
    ]

    const selectedTab = tabs.find(
        tab => matchPath(props.location.pathname, { path: tab.path, exact: tab.exact || false })
    );

    const selectMenuItem = (key: string | number) => {
        const selected = tabs.find(tab => tab.key === key);
        if (selected) {
            props.history.push(selected.path);
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
                    <div className={styles.Select} />
                    <span className={styles.Title}>
                        {selectedTab && selectedTab.title}
                    </span>
                    <Select value={currentCohort} onSelect={onSelectCohort} className={styles.Select}>
                        {cohorts.map(cohort => (
                            <Select.Option key={cohort.id} value={cohort.id}>{cohort.name}</Select.Option>
                        ))}
                    </Select>
                </Layout.Header>
                <Layout.Content className={styles.Content} style={{width: '100%'}}>
                    {props.content}
                </Layout.Content>
                <Layout.Footer className={styles.Footer}>HYPE - Hope for Youth Program</Layout.Footer>
            </Layout>
        </Layout>
    )
}

export default withRouter(NavBar);