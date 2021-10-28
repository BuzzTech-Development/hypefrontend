import{useState} from 'react';
import 'reactjs-popup/dist/index.css';
import {Button, Modal} from "antd";


const Danger = (props: any) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
      setIsModalVisible(true);
    };
  
    const handleOk = () => {
      props.callback();
      setIsModalVisible(false);
    };
  
    const handleCancel = () => {
      setIsModalVisible(false);
    };
    return (
        <>
            <Button type="primary" onClick={showModal} icon={props.icon} danger>
                {props.action}
            </Button>
            <Modal title={props.action} visible={isModalVisible} okType="danger" onOk={handleOk} onCancel={handleCancel}>
                <p>Are you sure you want to <b>{props.action}</b>?</p>
            </Modal>
        </>
    )
}





export default Danger;