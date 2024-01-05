import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogoutOutlined, RocketOutlined, CheckOutlined } from '@ant-design/icons';
import axios from 'axios';
const REACT_APP_BACKEND_API = import.meta.env.VITE_BACKEND_API;
import Cookies from 'js-cookie';
import { Button, Col, Row, Form, Radio, notification } from 'antd';
import './DoVote.css'; // Import your custom CSS file for additional styling
import Navbar from './NavigationBar';
import NavigationBar from './NavigationBar';

const DoVote = () => {
    const { state } = useLocation();
    const { email } = state || {};
    const [voted, setVoted] = useState(false);
    const [justVoted, setJustVoted] = useState(false);
    const [error, setError] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState(0)

    const [form] = Form.useForm();

    const navigate = useNavigate();

    useEffect(() => {
        axios.post(`${REACT_APP_BACKEND_API}/api/users/getVote`, { email: email }).then((res) => {
            setVoted(res.data.isVoted);
        });
    }, [email]);

    const onFinish = async (values) => {
        const urlVote = `${REACT_APP_BACKEND_API}/api/users/vote`;
        const vote = {
            vote: values.candidate,
        };

        try {
            setError('');
            const response = await axios.post(urlVote, vote);
            notification.success({
                message: `You have Successfully Voted to Candidate-${values.candidate} !!!`,
                placement: 'top'
            });
            selectedCandidate(0);
            setJustVoted(true);
            setVoted(true);
        } catch (error) {
            if (error.response) {
                notification.error({
                    message: error.response.data?.message,
                    placement: 'top'
                });
            }
        }
    };

    const handleVote = (vote) => {
        console.log('handleVote', vote);
        form.setFieldsValue({ candidate: vote });
        setSelectedCandidate(vote);
    };


    const logoutAction = () => {
        Cookies.remove('token');
        setJustVoted(false);
        setVoted(false);
        localStorage.setItem('isLoggedIn', false);
        notification.success({
            message: "Successfully logged out",
            placement: 'top'
        });
        navigate('/');
    };

    return (
        <>
            <NavigationBar email={email} logoutAction={logoutAction} />
            <Row className='px-4 pt-0 ' justify='center' align='middle'>
                <Col span={12} style={{ maxWidth: '640px', maxHeight: '640px' }}>
                    <Row justify='center'>
                        <h1 className='p-3 my-2 mt-0'></h1>
                    </Row>
                    <div className='container mt-5 vote-container'>
                        {!voted ? (
                            <Form form={form} onFinish={onFinish}>
                                {[1, 2, 3, 4].map((candidate) => (
                                    <Form.Item key={candidate} name='candidate' className='mb-3'>
                                        <Radio
                                            value={candidate}
                                            checked={selectedCandidate === candidate}
                                            onChange={() => handleVote(candidate)}
                                            className='candidate-radio'
                                        >
                                            Candidate {candidate}  {(selectedCandidate === candidate) ? <CheckOutlined /> : ''}

                                        </Radio>

                                    </Form.Item>
                                ))}
                                <Form.Item>
                                    <Button
                                        type='primary'
                                        block
                                        size='large'
                                        danger
                                        icon={<RocketOutlined />}
                                        disabled={voted}
                                        htmlType='submit'
                                        className='vote-button'
                                    >
                                        Vote
                                    </Button>
                                    {justVoted && <p className='text-success text-center'> Successfully Voted !!</p>}
                                </Form.Item>
                            </Form>
                        ) : justVoted ? (
                            <Form form={form}>
                                {[1, 2, 3, 4].map((candidate) => (
                                    <Form.Item key={candidate} name='candidate' className='mb-3'>
                                        <Radio
                                            value={candidate}
                                            checked={form.getFieldValue('candidate') === candidate}
                                            onChange={() => handleVote(candidate)}
                                            className='candidate-radio'
                                        >
                                            Candidate {candidate}
                                        </Radio>
                                    </Form.Item>
                                ))}
                                <Form.Item>
                                    <Button
                                        type='primary'
                                        block
                                        size='large'
                                        danger
                                        icon={<RocketOutlined />}
                                        disabled={voted}
                                        htmlType='submit'
                                        className='vote-button'
                                    >
                                        Vote
                                    </Button>
                                    {justVoted && <p className='text-success text-center'> Successfully Voted !!</p>}
                                </Form.Item>

                            </Form>
                        ) : <h1> You Have Already Voted! </h1>
                        }
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default DoVote;




