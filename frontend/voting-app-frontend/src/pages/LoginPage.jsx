import Cookies from 'js-cookie';
import React from 'react'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'
import NavigationBar from './NavigationBar';

const LoginPage = () => {

    const { state } = useLocation();
    const { email, password } = state || {};
    console.log("data :", email, password);


    const nevigate = useNavigate();
    const user = {
        email: email || "",
        password: password || ""
    };

    const loginSchema = yup.object().shape({
        email: yup.string().email("Please Enter Valid Email.").required("Please enter your email"),
        password: yup.string().min(5, "Minimum 5 Charecter Required")
            .matches(/[a-z]/, 'At least one lowercase letter is required')
            .matches(/[A-Z]/, 'At least one uppercase letter is required')
            .matches(/[!@#$%^&*(),.?":{}|<>]/, 'At least one symbol is required').required("Please enter your Password"),
    });
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: user,
        validationSchema: loginSchema,
        onSubmit: async (values, action) => {

            const userToBackend = {
                email: values.email,
                password: values.password
            }
            console.log(userToBackend);

            // console.log(process.env.REACT_APP_BACKEND_API)
            // const url = `${process.env.REACT_APP_BACKEND_API}/users/login`;
            const url = `http://localhost:5000/api/users/login`;
            console.log("URL : ", url);

            await axios.post(url, userToBackend).
                then((response) => {
                    console.log(response.data);
                    if (response.status !== 200) {
                        console.log("inside 200 wala error: ")
                        throw new Error(response.data.error);
                    }
                    if (response.data.role !== 'Admin') {
                        nevigate("/doVote", { state: { email: userToBackend.email } });
                        Cookies.set('token', response.data.token);
                        console.log(response.data.role);
                        console.log("inside ! Admin wala error: ")
                    }
                    if (response.data.role === 'Admin') {
                        console.log("inside if of admin");
                        Cookies.set('token', response.data.token);
                        console.log(response.data.role);
                        nevigate("/adminPanel")
                    } else {
                        console.log("Inside else");

                    }
                }
                ).catch((error) => {
                    console.log("Error: ", error.response.data.error);
                    Cookies.remove('token');
                    // nevigate('/error', { state: { message: error.message } });
                    // let errorMessage = error.response ? error.data.message || 'An unexpected error occurred.' : 'An unexpected error occurred.';
                    // nevigate("/error", { state: { data: errorMessage } });
                })

        }

    });
    
    return (
        <>
           
            <div className='justify-content-center align-items-center '>
                <div className='container w-50 h-100 mt-5 p-2 justify-content-center align-items-center text-center bg-body-secondary'>
                    <h1> LogIn </h1>

                    <form onSubmit={handleSubmit} method='POST' className='row justify-content-center mt-5'>

                        <input type='text' className='col-12 form-control w-50 p-2 m-2' id="email" name="email" placeholder="Enter Email..." onChange={handleChange} onBlur={handleBlur} value={values.email} />

                        <br />
                        {errors.email && touched.email ? (<p className='text-danger form-error' >{errors.email}
                        </p>) : null
                        }

                        <input type='password' className='form-control w-50 p-2 m-2' id="password" name="password" placeholder="Enter Password..." onChange={handleChange} onBlur={handleBlur} value={values.password} />

                        {errors.password && touched.password ? (<p className='text-danger'>{errors.password}
                        </p>) : null
                        }

                        <input type="submit" className='w-50 m-3 p-2 bg-primary fw-bold' value="LOGIN" />

                    </form>

                    <button className='btn btn-info'><Link to='/register'> Register  </Link></button>
                </div>
            </div >
        </>
    )
}

export default LoginPage