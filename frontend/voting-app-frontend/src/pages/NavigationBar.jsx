import React, { useEffect, useLayoutEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { LogoutOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Cookies from 'js-cookie';

const NavigationBar = ({ email, logoutAction }) => {

    const [loggedIn, setLoggedIn] = useState('');
    useEffect(() => {
        console.log('local ', localStorage.getItem('isLoggedIn'));
        setLoggedIn(localStorage.getItem('isLoggedIn'));
    }, [])




    return (
        <Navbar className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">Voting APP</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    {loggedIn ? (<>
                        <Navbar.Text>
                            Signed in as: <a>{email}</a>
                        </Navbar.Text>
                        <Navbar.Text>
                            <Button type='link' icon={<LogoutOutlined />} onClick={logoutAction} className='logout-button'>
                                Logout
                            </Button>
                        </Navbar.Text>
                    </>) : <></>}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavigationBar