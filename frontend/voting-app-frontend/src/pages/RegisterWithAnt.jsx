import { Button, Col, Form, Input, Row, Spin, message, notification } from 'antd'
import React, { useState } from 'react'
import { UserAddOutlined, PhoneFilled, MailOutlined, KeyOutlined, UserOutlined, SafetyOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const REACT_APP_BACKEND_API = import.meta.env.VITE_BACKEND_API;
import { triggerFocus } from 'antd/es/input/Input';

const RegisterWithAnt = () => {


    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const url = `${REACT_APP_BACKEND_API}/api/users/register`;

    const onFinishHandler = (values) => {
        console.log('onFinish()', values);
        const userObject = {
            name: values.name,
            email: values.email,
            password: values.password,
            phone: values.phone
        };
        ; (async () => {
            try {
                setIsLoading(true);
                setErrorMessage('');

                //API CALLING
                const response = await axios.post(url, userObject);

                console.log('response', response.data);
                Cookies.set('token', response.data.token);
                setIsLoading(false);
                navigate('/', { state: { email: userObject.email, password: userObject.password } });
            } catch (error) {
                setIsLoading(false);
                if (error.response) {
                    setErrorMessage(() => {
                        const newErrorMessage = error.response.data?.error;
                        console.log("data.error", error.response.data);
                        Cookies.remove('token');

                        // Use Ant Design notification for the error message
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
                        message: 'Something went Wrong !!',
                    });
                    setIsLoading(false);

                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                    notification.error({
                        message: 'Server Down !!',
                    });
                    setIsLoading(false);
                }
            }
        })();
    }

    return (
        <>
            <Row className='p-4 m-5' justify={'center'} align={'middle'}  >
                <Col className='bg-light py-4 px-2 pe-3' span={12} style={{ maxWidth: '640px', maxHeight: '640px' }}>
                    <Row justify={'center'}><h1 className='p-3 mt-0 text-danger-emphasis'>Voting App</h1></Row>
                    <Row justify={'center'}><h2 className='p-3 my-2 mt-0'> REGISTRATION FORM</h2></Row>

                    {isLoading ? (<Spin size='large' > <Form autoComplete='off'
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        onFinish={(values) => {
                            onFinishHandler(values);
                        }}
                        onFinishFailed={(error) => {
                            console.log("error :", error);
                        }}

                    >
                        <Form.Item name={'name'} label={'Name'} rules={[{
                            required: true,
                            message: 'Please enter your Name'
                        }, { whitespace: true },
                        {
                            min: 3,
                            message: "Atleast 3 characters"
                        }]}
                            hasFeedback>
                            <Input addonBefore={<UserOutlined />} placeholder='Type your name..' />
                        </Form.Item>

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
                                pattern: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
                                message: 'Enter a password with at least one letter and one number',
                            },
                        ]}
                            hasFeedback>
                            <Input.Password addonBefore={<KeyOutlined />} placeholder='Type your password...' />
                        </Form.Item>

                        <Form.Item name={'conformPassword'} label={'Conform Password'} dependencies={['password']} rules={[
                            { required: true, message: 'Please conform password' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('Two Passwords must be the same')
                                }
                            })
                        ]}
                            hasFeedback>
                            <Input.Password addonBefore={<SafetyOutlined />} placeholder='Conform Your Password...' />
                        </Form.Item>

                        <Form.Item name={'phone'} label={'Phone No.'} rules={[
                            { required: true, message: 'Please enter your Phone' },
                            {
                                pattern: /^[6-9][0-9]{9}$/,
                                message: 'Please enter a valid 10-digit phone number starting with 6, 7, 8, or 9',
                            },
                        ]}
                            hasFeedback
                        >
                            <Input addonBefore={<PhoneFilled />} placeholder='Type your phone number..' />
                        </Form.Item>

                        <Form.Item className='my-5' wrapperCol={{ span: 16, offset: 5 }}>
                            <Button icon={<UserAddOutlined />} shape="default" block type='primary' htmlType='submit'  > Register </Button>
                        </Form.Item>
                    </Form></Spin>)
                        :
                        <Form autoComplete='off'
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}
                            onFinish={(values) => {
                                onFinishHandler(values);
                            }}

                            onFinishFailed={(error) => {
                                triggerFocus(Input);
                                console.log("error :", error);
                            }}

                        >
                            <Form.Item name={'name'} label={'Name'} rules={[{
                                required: true,
                                message: 'Please enter your Name'
                            }, { whitespace: true },
                            {
                                min: 3,
                                message: "Atleast 3 characters"
                            }]}

                                hasFeedback>
                                <Input addonBefore={<UserOutlined />} placeholder='Type your name..' />
                            </Form.Item>

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
                                    pattern: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
                                    message: 'Enter a password with at least one letter and one number',
                                },
                            ]}
                                hasFeedback>
                                <Input.Password addonBefore={<KeyOutlined />} placeholder='Type your password...' />
                            </Form.Item>

                            <Form.Item name={'conformPassword'} label={'Conform Password'} dependencies={['password']} rules={[
                                { required: true, message: 'Please conform password' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('Two Passwords must be the same')
                                    }
                                })
                            ]}
                                hasFeedback>
                                <Input.Password addonBefore={<SafetyOutlined />} placeholder='Conform Your Password...' />
                            </Form.Item>

                            <Form.Item name={'phone'} label={'Phone No.'} rules={[
                                { required: true, message: 'Please enter your Phone' },
                                {
                                    pattern: /^[6-9][0-9]{9}$/,
                                    message: 'Please enter a valid 10-digit phone number starting with 6, 7, 8, or 9',
                                },
                            ]}
                                hasFeedback
                            >
                                <Input addonBefore={<PhoneFilled />} placeholder='Type your phone number..' />
                            </Form.Item>

                            <Form.Item className='my-5' wrapperCol={{ span: 16, offset: 5 }}>
                                <Button icon={<UserAddOutlined />} shape="default" block type='primary' htmlType='submit' > Register </Button>
                            </Form.Item>
                        </Form>}
                    <Row justify={'center'}> <h6>Already registered? <Link to={'/'}>Login</Link></h6></Row>
                </Col>

            </Row>

        </>
    )
}

export default RegisterWithAnt