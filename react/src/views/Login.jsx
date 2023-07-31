import { Link } from "react-router-dom";
import { createRef, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "./axios-client";

export default function Login() {
    const emailRef = createRef();
    const passwordRef = createRef();
    const { setUser, setToken } = useStateContext();
    const [errors, setErrors] = useState(null);

    const onSubmit = (e) => {
        e.preventDefault();

        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }
        axiosClient.post('/login', payload)
            .then(({data}) => {
                setUser(data.user)
                setToken(data.token);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors)
                }
        })
    }

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">Đăng nhập vào tài khoản</h1>

                    {errors &&
                        <div className="alert">
                        {Object.keys(errors).map(key => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                        </div>
                    }

                    <input ref={emailRef} type="email" placeholder="Địa chỉ email" aria-label="email" />
                    <input ref={passwordRef} type="password" placeholder="Mật khẩu" aria-label="password" />
                    <button className="btn btn-block">Đăng nhập</button>
                    <p className="message">
                        Chưa đăng ký? <Link to="/signup">Tạo một tài khoản</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
