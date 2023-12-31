import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Space, Button, notification, Spin } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false)
    useEffect(() => {

        const fetchCandidates = async () => {
            try {
                setLoading(true);
                const urlAdmin = `http://localhost:5000/api/users/vote`;
                const response = await axios.get(urlAdmin);
                setCandidates(response.data);
                console.table(response.data);
                setLoding(false);
            } catch (error) {
                console.error('Error fetching candidates:', error);
                setLoading(false);
            }
        };
        fetchCandidates();
    }, []);

    const handleLogout = () => {
        Cookies.remove('token');
        notification.success({
            message: "Admin Logged Out Successfully !!!"
        })
        navigate('/');
    };

    const columns = [
        {
            title: <strong>Candidate</strong>,
            dataIndex: 'candidate',
            key: 'candidate',
            render: (text) => <b>{text}</b>,
        },
        {
            title: <strong>Votes</strong>,
            dataIndex: 'votes',
            key: 'votes',
        },
    ];

    const dataSource =
        candidates.length > 0
            ? Object.keys(candidates[0])
                .filter((key) => key !== '_id' && key !== 'updatedAt')
                .map((candidate) => ({
                    key: candidate,
                    candidate: candidate,
                    votes: candidates[0][candidate],
                }))
            : [];

    return (
        <div className='container mt-4'>
            <h2>Admin Panel</h2>
            {loading ? (<Spin><Table columns={columns} dataSource={dataSource} bordered responsive /></Spin>) :
                <Table columns={columns} dataSource={dataSource} bordered responsive />}
            <Space direction='vertical' style={{ marginTop: '20px' }}>
                <Button type='primary' icon={<LogoutOutlined />} onClick={handleLogout}>
                    Logout
                </Button>
            </Space>
        </div>
    );
};

export default AdminPanel;





// import axios from 'axios'
// import React, { useEffect, useState } from 'react'
// import '../../axiosConfig';
// import Cookies from 'js-cookie';
// import { useNavigate } from 'react-router-dom';

// const AdminPanel = () => {

//     const navigate = useNavigate();
//     const [candidates, setCandidates] = useState([{}]);

//     useEffect(() => {
//         const fetchCandidates = async () => {
//             try {
//                 const urlAdmin = ` http://localhost:5000/api/users/vote`;
//                 const response = await axios.get(urlAdmin);
//                 setCandidates(response.data);
//                 console.table(response.data);

//             } catch (error) {
//                 console.error('Error fetching candidates:', error);
//             }
//         };

//         fetchCandidates();
//     }, []);
//     console.log("candidates", candidates);
//     console.log("candidate 1 :", candidates[0].candidate1);
//     console.log("candidate value : ", candidates[0]['candidate1'])

//     const handleLogout = () => {
//         console.log('logged out');
//         Cookies.remove('token');
//         navigate('/');

//     }

//     return (
//         <div className="container mt-4">
//             <h2>Admin Panel</h2>
//             <table className="table">
//                 <thead>
//                     <tr>
//                         <th scope="col">Candidate</th>
//                         <th scope="col">Votes</th>
//                     </tr>
//                 </thead>
//                 {candidates.length > 0 ? (
//                     Object.keys(candidates[0]).map((candidate, index) => (
//                         <tr key={index}>
//                             <td>{candidate != '_id' && candidate != 'updatedAt' && candidate}</td>
//                             <td>{candidate != '_id' && candidate != 'updatedAt' && candidates[0][candidate]}</td>
//                         </tr>
//                     ))
//                 ) : (
//                     <tr>
//                         <td colSpan="2">No candidates available</td>
//                     </tr>
//                 )}
//                 <tbody>

//                 </tbody>
//             </table>
//             <button className="btn btn-primary" onClick={handleLogout}>
//                 Logout
//             </button>
//         </div>
//     );
// };

// export default AdminPanel;

