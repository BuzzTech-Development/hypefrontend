import{ useState} from 'react';
import 'reactjs-popup/dist/index.css';
import {Button, Modal, Form, Input, Layout} from "antd";
import {MessageOutlined} from '@ant-design/icons';
import styles from './Home.module.css';

const Message = (props: any) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
      setIsModalVisible(true);
    };
  
    const handleOk = () => {
      // Send Message
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
            <Modal style={{ padding: "0px" }} onOk={handleOk} onCancel={handleCancel} visible={isModalVisible}>
              <Layout style={{ margin: "0px" }}>
                  <Layout.Header className={styles.Header}>
                      <span className={styles.Title}>
                          Send A Message to {props.to}
                      </span>
                  </Layout.Header>
                  <Layout.Content className={styles.Content}>
                    <Form>
                      <Form.Item label="Subject" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item label="Body" rules={[{ required: true }]}>
                        <Input.TextArea />
                      </Form.Item>

                    </Form>
                  </Layout.Content>
              </Layout>
            </Modal>
        </>
    )
}





export default Message;