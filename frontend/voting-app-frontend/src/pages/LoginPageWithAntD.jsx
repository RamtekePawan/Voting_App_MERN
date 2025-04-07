import { Button, Col, Form, Input, Row, Spin, notification } from 'antd'
import { LoginOutlined, MailOutlined, KeyOutlined } from '@ant-design/icons';
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const REACT_APP_BACKEND_API = import.meta.env.VITE_BACKEND_API;
import config from '../../config/config'
import axios from 'axios';


const LoginPageWithAntD = () => {

    const { state } = useLocation();
    const { email, password } = state || {};
    console.log("useLocation =>", email, password);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState(false);

    const navigate = useNavigate();
    const user = {
        email: email || "",
        password: password || ""
    };

   
    const url = `${config.backendUrl}/api/users/login`;


    const loginHandler = (values) => {
        console.log("values : ", values);
        const userToBackend = {
            email: values.email,
            password: values.password
        }; 
        
        (async () => {
                try {
                    setIsLoading(true);
                    setErrorMessage('');
                    setError(false);
                    //API CALLING
                    const response = await axios.post(url, userToBackend);

                    console.log('response', response.data);
                    Cookies.set('token', response.data.token);
                    localStorage.setItem('isLoggedIn', 'user Is LoggedIn');
                    console.log(response.data);
                    if (response.status !== 200) {
                        console.log("inside 200 wala error: ")
                        throw new Error(response.data.error);
                    }
                    if (response.data.role !== 'Admin') {
                        Cookies.set('token', response.data.token);
                        setIsLoading(false);
                        notification.success({
                            message: `Welcome ${values.email} !!!`,
                            placement: 'top'
                        })
                        navigate("/doVote", { state: { email: userToBackend.email } });
                        console.log(response.data.role);

                    }
                    if (response.data.role === 'Admin') {
                        Cookies.set('token', response.data.token);
                        console.log(response.data.role);
                        notification.success({
                            message: "Welcome  ADMIN !!!",
                            placement: 'top'
                        })
                        navigate("/adminPanel")
                    }
                } catch (error) {
                    if (error.response) {
                        setErrorMessage(() => {
                            const newErrorMessage = error.response.data.message;
                            console.log("data.error", error.response.data.message);
                            Cookies.remove('token');
                            notification.error({
                                message: newErrorMessage,
                            });
                            setIsLoading(false);
                            return newErrorMessage;
                        });
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        console.log("error.request :", error.request);
                        notification.error({
                            message: 'Something Went Wrong !!',
                        });
                        setIsLoading(false);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                        notification.error({
                            message: "Server Down !!!",
                        });
                        setIsLoading(false);
                    }

                }
            })();
    }

    return (
        <div>
            <Row className='p-4 m-5' justify={'center'} align={'middle'}  >
                    <Col>
                        <Col className='bg-light py-3 px-2 pe-5'> 
                        {/* style={{ maxWidth: '640px', maxHeight: '640px' }} */}
                            <Row justify={'center'}><h1 className='p-3 ps-3 ms-4 mt-0 text-danger-emphasis'>Voting App</h1></Row>
                            <Row justify={'center'}><h1 className='p-3 my-2 mt-0 mb-3 ps-5'> Login </h1></Row>
                            {isLoading ? (<Spin size='large'><Form autoComplete='off'
                                labelCol={{ span: 7 }}
                                wrapperCol={{ span: 17 }}
                                onFinish={(values) => {
                                    loginHandler(values);
                                }}
                                onFinishFailed={(error) => {
                                    console.log("error :", error);
                                }}
                            >

                                <Form.Item name={'email'} label={'Email'} rules={[
                                    { required: true, message: 'Please enter your Email' },
                                    { type: 'email', message: 'Please enter valid email' }
                                ]}
                                    hasFeedback>
                                    <Input value={user.email} addonBefore={<MailOutlined />} placeholder='Type your email..' />
                                </Form.Item>

                                <Form.Item name={'password'} label={'Password'} rules={[
                                    { required: true, message: 'Please enter your Password' },
                                    { min: 6, message: 'Please enter valid password' },
                                    {
                                        pattern: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
                                        message: 'Enter a password with at least one letter and one number',
                                    },
                                ]}
                                    hasFeedback>
                                    <Input.Password value={user.password} addonBefore={<KeyOutlined />} placeholder='Type your password...' />
                                </Form.Item>
                                <Form.Item className='my-5' wrapperCol={{ span: 16, offset: 5 }}>
                                    <Button icon={<LoginOutlined />} shape="default" block type='primary' htmlType='submit' > Login </Button>
                                </Form.Item>


                            </Form></Spin>) :
                                (<Form autoComplete='off'
                                    labelCol={{ span: 7 }}
                                    wrapperCol={{ span: 17 }}
                                    onFinish={(values) => {
                                        loginHandler(values);
                                    }}
                                    initialValues={user || {}}
                                    onFinishFailed={(error) => {
                                        console.log("error :", error);
                                    }}
                                >

                                    <Form.Item name={'email'} label={'Email'} rules={[
                                        { required: true, message: 'Please enter your Email' },
                                        { type: 'email', message: 'Please enter valid email' }
                                    ]}
                                        hasFeedback>
                                        <Input addonBefore={<MailOutlined />} placeholder='Type your email..' />
                                    </Form.Item>

                                    <Form.Item name={'password'} label={'Password'} rules={[
                                        { required: true, message: 'Please enter your Password' },
                                        { min: 6, message: 'Please enter valid password' },
                                        {
                                            pattern: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
                                            message: 'Enter a password with at least one letter and one number',
                                        },
                                    ]}
                                        hasFeedback>
                                        <Input.Password addonBefore={<KeyOutlined />} placeholder='Type your password...' />
                                    </Form.Item>
                                    <Form.Item className='my-5' wrapperCol={{ span: 16, offset: 5 }}>
                                        <Button icon={<LoginOutlined />} shape="default" block type='primary' htmlType='submit' > Login </Button>
                                    </Form.Item>


                                </Form>)
                            }
                            <Row justify={'center'}> <h6> New to the App ?  <Link to={'/register'}>Register</Link></h6></Row>

                        </Col>
                    </Col>
                </Row>
  
        </div>
    )
}

export default LoginPageWithAntD