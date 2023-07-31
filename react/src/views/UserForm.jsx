import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "./axios-client";

export default function UserForm() {
    let {id} = useParams();
    const navigate = useNavigate();
    const {setNotification} = useStateContext();
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    if (id) {
        useEffect(() => {
            setLoading(true)
            axiosClient.get(`/users/${id}`)
                .then(({data}) => {
                    setLoading(false)
                    setUser(data)
                })
                .catch(() => {
                    setLoading(false)
                })
        }, [])
    }
  
    const onSubmit = (e) => {
      e.preventDefault()

      if (user.id) {
        axiosClient.put(`/users/${user.id}`, user)
          .then(() => {
            setNotification('Người dùng đã được cập nhật thành công.')
            navigate('/users')
          })
          .catch(err => {
            const response = err.response;
            if (response && response.status === 422) {
              setErrors(response.data.errors)
            }
          })
      } else {
        axiosClient.post('/users', user)
          .then(() => {
            setNotification('Người dùng đã được tạo thành công.')
            navigate('/users')
          })
          .catch(err => {
            const response = err.response;
            if (response && response.status === 422) {
              setErrors(response.data.errors)
            }
          })
      }
    };

    return (
        <>
            { user.id && 
                <div className="text-left">
                    <h1>Cập nhập tài khoản: {user.name}</h1> 
                    <nav className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/users" >Quản lý người dùng</Link></li>
                        <li className="breadcrumb-item">Cập nhập tài khoản</li>
                    </nav>
                </div>
            }
            { !user.id && 
                <div className="text-left">
                    <h1>Tạo mới tài khoản</h1> 
                    <nav className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/users" >Quản lý người dùng</Link></li>
                        <li className="breadcrumb-item">Tạo mới tài khoản</li>
                    </nav>
                </div>
            }
            <div className="card animated fadeInDown">
                {loading && (
                    <>Loading...</>
                )}
                {errors &&
                    <div className="alert">
                        {Object.keys(errors).map(key => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                }
                {!loading && (
                    <form onSubmit={onSubmit}>
                        <input type="text" 
                            placeholder="Họ và tên" 
                            aria-label="Full Name" 
                            value={user.name} 
                            onChange={(e) => setUser({...user, name: e.target.value})} 
                        />
                        <input type="email" 
                            placeholder="Địa chỉ email" 
                            aria-label="Email Address" 
                            value={user.email} 
                            onChange={(e) => setUser({...user, email: e.target.value})} 
                        />
                        <input type="password" 
                            placeholder="Mật khẩu" 
                            aria-label="Password" 
                            onChange={(e) => setUser({...user, password: e.target.value})} 
                        />
                        <input type="password" 
                            placeholder="Lặp lại mật khẩu" 
                            aria-label="Password Confirmation" 
                            onChange={(e) => setUser({...user, password_confirmation: e.target.value})}
                        />
                        <button className="btn">Lưu</button>
                    </form>
                )}
            </div>
        </>
    )
}
