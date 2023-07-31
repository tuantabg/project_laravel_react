import { useEffect, useState } from "react";
import axiosClient from "./axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function Users() {
    const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext();

    useEffect(() => {
        getUsers()
    }, [])

    const onDeleteClick = (user) => {

        if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
          return
        }
        axiosClient.delete(`/users/${user.id}`)
          .then(() => {
            setNotification('Người dùng đã được xóa thành công')
            getUsers()
          })
      }

    const getUsers = () => {
        setLoading(true)
        axiosClient.get('/users')
            .then(({data}) => {
                setLoading(false)
                setUsers(data.data)
            })
            .catch(() => {
                setLoading(false);
            })
    };

    return (
        <>
            <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
                <h1>Quản lý người dùng</h1>
                <Link className="btn-add" to="/users/new">Thêm mới</Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Họ và tên</th>
                            <th>Email</th>
                            <th>Tạo ngày</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    {loading &&
                        <tbody>
                        <tr>
                        <td colSpan="5" className="text-center">
                            Loading...
                        </td>
                        </tr>
                        </tbody>
                    }
                    {!loading &&
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.created_at}</td>
                                    <td>
                                        <Link className="btn-edit" to={'/users/' + user.id}>Chỉnh sửa</Link>
                                        &nbsp;
                                        <button className="btn-delete" onClick={() => onDeleteClick(user)}>Xóa bỏ</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    }
                </table>
            </div>
        </>
    )
}
