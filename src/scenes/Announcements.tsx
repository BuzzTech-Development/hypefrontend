import React from 'react';
import {useSelector} from "react-redux";
import {Empty, List} from "antd";
import {Announcement, announcementsSelectors} from "../redux/announcementsSlice";

const Announcements = () => {
    const announcements = useSelector(announcementsSelectors.selectAll);

    if (!announcements) {
        return  <Empty description="You have no new announcements" />;
    }

    return (
        <List
            dataSource={announcements}
            renderItem={(announcement: Announcement) => (
                <List.Item>
                    <List.Item.Meta
                        title={`${announcement.subject} (${announcement.created_at.slice(0, 10)})`}
                        description={announcement.text}
                    />
                </List.Item>
            )}
            itemLayout="horizontal"
            bordered
            style={{ width: "100%", }}
        />
    );
}

export default Announcements;