import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogoutOutlined, RocketOutlined } from '@ant-design/icons';
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
            form.resetFields();
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
        form.setFieldsValue({ candidate: vote });
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
                                <Form.Item>
                                    <Button type='primary' icon={<LogoutOutlined />} onClick={logoutAction} className='logout-button'>
                                        Logout
                                    </Button>
                                </Form.Item>
                            </Form>
                        ) : justVoted ? (
                            <Form form={form} onFinish={onFinish}>
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




// import React, { useEffect, useState } from 'react'
// import { useLocation, useNavigate } from 'react-router-dom';
// import { LogoutOutlined, RocketOutlined } from '@ant-design/icons';
// import '../../axiosConfig';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { Button, Col, Input, Row, notification } from 'antd';
// import { icons } from 'antd/es/image/PreviewGroup';


//*
// <Radio
//     value={candidate}
//     checked={form.getFieldValue('candidate') === candidate}
//     onChange={() => handleVote(candidate)}
//     className='candidate-radio'
// >
//     Candidate {candidate}
// </Radio>


// const DoVote = () => {
//     const { state } = useLocation();
//     const { email } = state;

//     const [voted, setVoted] = useState(false);
//     const [error, setError] = useState('');
//     const [selectedCandidate, setSelectedCandidate] = useState(0);
//     const navigate = useNavigate();

//     const logoutAction = () => {
//         Cookies.remove('token');
//         setVoted(false);
//         navigate('/');
//     }
//     useEffect(() => {
//         axios.post(`http://localhost:5000/api/users/getVote`, { email: email }).then((res) => {
//             console.log(res.data);
//             console.log(res.data.isVoted)
//             setVoted(res.data.isVoted);
//         })
//     }, []);

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         // Perform voting logic with the selected candidate

//         const urlVote = `http://localhost:5000/api/users/vote`;
//         const vote = {
//             vote: selectedCandidate
//         };
//         console.log('Voted for candidate:', vote);

//         await axios.post(urlVote, vote)
//             .then((response) => {
//                 setError('');
//                 console.log("voted :", response.data);
//                 notification.success({
//                     message: `You have Successfully Voted to Candidate-${selectedCandidate} !!!`
//                 });
//                 setSelectedCandidate(0);
//             }).catch((error) => {
//                 if (error.response) {

//                     console.log(error.response.data?.message);
//                     ; (async () => {
//                         notification.error({
//                             message: error.response.data?.message,
//                         })
//                     })()
//                     setSelectedCandidate(0);
//                 }
//             })
//     }

//     const handleVote = (vote) => {
//         setSelectedCandidate(vote);
//     }



//     return (
//         <Row className='p-4 m-5' justify={'center'} align={'middle'}  >
//             <Col className='bg-light py-5 px-2 pe-3' span={12} style={{ maxWidth: '640px', maxHeight: '640px' }}>
//                 <Row justify={'center'}><h1 className='p-3 my-2 mt-0'> </h1></Row>

//                 <div className='container mt-5'>
//                     <h6 className='text-end'>{state.email}</h6>
//                     <div className='d-flex justify-content-center'>
//                         <h1>Do Vote</h1>
//                     </div>
//                     <form onSubmit={handleSubmit} method='post'>
//                         <div className='mb-3'>
//                             <label className='form-check-label'>
//                                 <input
//                                     type='radio'
//                                     name='candidate'
//                                     id='1'
//                                     value='1'
//                                     checked={selectedCandidate === 1}
//                                     onChange={() => handleVote(1)}
//                                     className='form-check-input'
//                                 />
//                                 Candidate 1
//                             </label>
//                         </div>

//                         <div className='mb-3'>
//                             <label className='form-check-label'>
//                                 <input
//                                     type='radio'
//                                     name='candidate'
//                                     id='2'
//                                     value='2'
//                                     checked={selectedCandidate === 2}
//                                     onChange={() => handleVote(2)}
//                                     className='form-check-input'
//                                 />
//                                 Candidate 2
//                             </label>
//                         </div>

//                         <div className='mb-3'>
//                             <label className='form-check-label'>
//                                 <input
//                                     type='radio'
//                                     name='candidate'
//                                     id='3'
//                                     value='3'
//                                     checked={selectedCandidate === 3}
//                                     onChange={() => handleVote(3)}
//                                     className='form-check-input'
//                                 />
//                                 Candidate 3
//                             </label>
//                         </div>

//                         <div className='mb-3'>
//                             <label className='form-check-label'>
//                                 <input
//                                     type='radio'
//                                     name='candidate'
//                                     id='4'
//                                     value='4'
//                                     checked={selectedCandidate === 4}
//                                     onChange={() => handleVote(4)}
//                                     className='form-check-input'
//                                 />
//                                 Candidate 4
//                             </label>
//                         </div>

//                         <div className='mb-3'>
//                             <Button type='primary' block size='large' danger icon={<RocketOutlined />}  disabled={voted} onClick={handleSubmit} className='btn btn-primary'>
//                                 Vote
//                             </Button>
//                         </div>
//                         <div className='mb-3'>
//                             <Button type='primary' icon={<LogoutOutlined />} onClick={logoutAction}  className='btn btn-primary'>
//                                 Logout
//                             </Button>
//                         </div>
//                     </form>
//                 </div>
//                 );
//             </Col>
//         </Row>
//     )

// }

// export default DoVote

