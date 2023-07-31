import { useEffect } from "react";
import { Outlet, Navigate, Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../views/axios-client";


export default function DefaultLayout() {
    const { user, token, notification, setUser, setToken } = useStateContext()

    if (!token) {
        return <Navigate to="/login" />
    }

    const onLogout = (e) => {
        e.preventDefault();

        axiosClient.post('/logout')
        .then(() => {
            setUser({})
            setToken(null)
        })
    };

    useEffect(() => {
        axiosClient.get('/user')
          .then(({data}) => {
             setUser(data)
          })
      }, [])

    return (
        <div id="defaultLayout">
            <aside>
                <Link to="/dashboard">Bảng điều khiển</Link>
                <Link to="/users">Quản lý người dùng</Link>
            </aside>
            <div className="content">
                <header>
                    <div>
                        Header
                    </div>
                    <div>
                        {user.name} &nbsp;
                        <a onClick={onLogout} className="btn-logout" href="#">Đăng xuất</a>
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
                {notification &&
                    <div className="notification">
                        {notification}
                    </div>
                }
            </div>
        </div>
    )
}
