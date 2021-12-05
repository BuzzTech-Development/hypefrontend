import{ useState} from 'react';
import 'reactjs-popup/dist/index.css';
import {Button, Modal, Form, Input, Layout} from "antd";
import {MessageOutlined} from '@ant-design/icons';
import styles from './Home.module.css';
import apiInstance from 'utils/api';

const Message = (props: any) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const cohortID = props.cohort;

    const showModal = () => {
      setIsModalVisible(true);
    };
  
    const handleOk = (values: { subject: string, body: string }) => {
      // Send Message
      console.log("id: ", cohortID);
      apiInstance.makeAnnouncement(cohortID, values.subject, values.body);
      setIsModalVisible(false);
    };
  
    const handleCancel = () => {
      // Do nothing!
      setIsModalVisible(false);
    };
    return (
        <>
            <Button type="primary" onClick={showModal} icon={<MessageOutlined/>}>
                Message
            </Button>
            <Modal style={{ padding: "0px" }}  onCancel={handleCancel} visible={isModalVisible}>
              <Layout style={{ margin: "0px" }}>
                  <Layout.Header className={styles.Header}>
                      <span className={styles.Title}>
                          Send A Message to {props.to}
                      </span>
                  </Layout.Header>
                  <Layout.Content className={styles.Content}>
                    <Form onFinish={handleOk}>
                      <Form.Item label="Subject" name="subject" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item label="Body" name="body" rules={[{ required: true }]}>
                        <Input.TextArea />
                      </Form.Item>
                      <Form.Item>
                        
                        <Button type="primary" htmlType="submit">
                            Send Message
                        </Button>
                      </Form.Item>
                    </Form>
                  </Layout.Content>
              </Layout>
            </Modal>
        </>
    )
}





export default Message;