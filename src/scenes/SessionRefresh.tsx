import{useState} from 'react';
import 'reactjs-popup/dist/index.css';
import {Modal} from "antd";
import apiInstance from "utils/api";


const SessionRefresh = (props: any) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
      setIsModalVisible(true);
    };
  
    const handleOk = () => {
      // Make a request to continue the session
      apiInstance.refreshToken();
      setIsModalVisible(false);
    };
  
    const handleCancel = () => {
      // Log the user out
      apiInstance.removeTokenAuth();
      // Take the user to the login screen
      
      setIsModalVisible(false);
    };
    
    return (
        <>
            <Modal title="User Timeout" 
                    visible={isModalVisible} 
                    onOk={handleOk} 
                    okText="Stay Logged In" 
                    onCancel={handleCancel}
                    cancelText="Log Out">
                <p>You will be logged out in 30 seconds. Would you like to continue?</p>
            </Modal>
        </>
    )
}

export default SessionRefresh;