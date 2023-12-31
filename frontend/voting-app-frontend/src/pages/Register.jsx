import React from 'react'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import cookie from 'js-cookie'

const Register = () => {

    const navigate = useNavigate();

    const user = {
        name: '',
        email: '',
        password: '',
        phone: '',
    }
    const registervalidation = yup.object().shape({
        email: yup.string().email("Please Enter Valid Email.").required("Please enter your email"),
        password: yup.string().min(5, "Minimum 5 Charecter Required")
            .matches(/[a-z]/, 'At least one lowercase letter is required')
            .matches(/[A-Z]/, 'At least one uppercase letter is required')
            .matches(/[!@#$%^&*(),.?":{}|<>]/, 'At least one symbol is required').required("Please enter your Password"),
        phone: yup.string()
            .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
            .required('Mobile number is required'),
    });

    const url = `http://localhost:5000/api/users/register`;

    const { values, errors, touched, handleBlur, handleChange, handleSubmit, } = useFormik({
        initialValues: user,
        validationSchema: registervalidation,

        onSubmit: async (values, action) => {
            console.log('onsubmit registration');
            const userObject = {
                name: values.name,
                email: values.email,
                password: values.password,
                phone: values.phone
            }

            await axios.post(url, userObject).then((res) => {
                if (res.status === 400) {
                    navigate('/error', { state: { message: res.data.message } })
                }
                cookie.set('token', res.data.token);
                navigate('/', { state: { email: values.email, password: values.password } });
            }).catch((err) => {
                cookie.remove('token');
                console.error(err);
            })

        }
    })


    return (
        <>
            <h1 className='text-center'>Register</h1>
            <form onSubmit={handleSubmit} method='post' className='row justify-content-center mt-5'>

                <input type='text' className='col-12 form-control w-50 p-2 m-2' id="name" name="name" placeholder="Enter Name..." onChange={handleChange} onBlur={handleBlur} value={values.name} />

                <br />
                {errors.name && touched.name ? (<p className='text-danger text-center' >{errors.name}
                </p>) : null
                }

                <input type='text' className='col-12 form-control w-50 p-2 m-2' id="email" name="email" placeholder="Enter Email..." onChange={handleChange} onBlur={handleBlur} value={values.email} />


                {errors.email && touched.email ? (<p className='text-danger text-center ' >{errors.email}
                </p>) : null
                }

                <input type='password' className='form-control w-50 p-2 m-2' id="password" name="password" placeholder="Enter Password..." onChange={handleChange} onBlur={handleBlur} value={values.password} />
                <br />
                {errors.password && touched.password ? (<p className='text-danger text-center '>{errors.password}
                </p>) : null
                }

                <input type='text' className='form-control w-50 p-2 m-2' id="phone" name="phone" placeholder="Enter Phone Number..." onChange={handleChange} onBlur={handleBlur} value={values.phone} />
                <br />
                {errors.phone && touched.phone ? (<p className='text-danger text-center'>{errors.phone}
                </p>) : null
                }

                <input type="submit" className='w-50 m-3 p-2 bg-primary fw-bold btn btn-light ' value="Submit" />

            </form>
            <div className='d-flex justify-content-center'><h5>Already Registered ? <Link to="/">Login</Link></h5></div>
        </>

    )
}

export default Register