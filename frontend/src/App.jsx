import { useState, useEffect } from 'react';
import './App.css';
import apiPath from './path';
import axios from "axios"

function App() {
  let [task, setTask] = useState({ username: "", email: "", phone: "" });
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0)
  const [editStates, setEditStates] = useState({});
  const handleAdd = async () => {
    try {
      const res = await axios.post(`${apiPath()}/adduser`, task);

      if (res.status === 201) {
        setCount(count + 1);
        alert(res.data.msg);
        setTask({ username: "", email: "", phone: "" });
      }

    } catch (error) {
      console.log(error);

    }

  }

  useEffect(() => {
    fetch(`${apiPath()}/getuser`)
      .then(res => res.json())
      .then((out) => {
        setData(out);

      });
  }, [count]);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${apiPath()}/deleteuser/${id}`);
      if (res.status === 200) {
        alert(res.data.msg);
        setCount(count + 1);
      }
    } catch (error) {
      console.log(error);

    }
  }

  const handleEdit = (id) => {
    setEditStates((prevStates) => ({
      ...prevStates,
      [id]: true,
    }));
  };
  const handleInputChange = (id, name, value) => {
    setData((prevData) =>
      prevData.map((user) =>
        user._id === id ? { ...user, [name]: value } : user
      )
    );
  };


  const handleUpdate = async (id) => {
    try {
      const updatedUser = data.find((user) => user._id === id); 
      const res = await axios.put(`${apiPath()}/updateuser/${id}`, updatedUser);
      if (res.status === 200) {
        alert(res.data.msg);
        setCount(count + 1);
        setEditStates((prevStates) => ({
          ...prevStates,
          [id]: false, 
        }));
      }
    } catch (error) {
      console.log(error);
    }
  }



  return (
    <div className="app-container">
      <div className="input-section">
        <input type="text" name="username" onChange={(e) => setTask((pre) => ({ ...pre, [e.target.name]: e.target.value }))} value={task.username} placeholder="Name" className="input-field1" />
        <input type="text" name="email" onChange={(e) => setTask((pre) => ({ ...pre, [e.target.name]: e.target.value }))} value={task.email} placeholder="Email" className="input-field1" />
        <input type="text" name="phone" onChange={(e) => setTask((pre) => ({ ...pre, [e.target.name]: e.target.value }))} value={task.phone} placeholder="Phone" className="input-field1" />
        <button className="add-button" onClick={handleAdd}>Add</button>
      </div>
      <table className="item-table">
        <tbody>
          {data.map((item, ind) => (<tr>
            <td key={ind}>
              <input type="text" className="input-field" value={item.username} disabled={!editStates[item._id]} onChange={(e) =>
                handleInputChange(item._id, "username", e.target.value)
              } />
              <input type="text" className="input-field" value={item.email} disabled={!editStates[item._id]} onChange={(e) =>
                handleInputChange(item._id, "email", e.target.value)} />
              <input type="text" className="input-field" value={item.phone} disabled={!editStates[item._id]} onChange={(e) =>
                handleInputChange(item._id, "phone", e.target.value)} />
              <button className="action-button" onClick={() => handleEdit(item._id)}>Edit</button>
              <button className="action-button delete-button" onClick={() => handleDelete(item._id)}>Delete</button>
              <button className="action-button" onClick={() => handleUpdate(item._id)}>update</button>
            </td>
          </tr>))}

        </tbody>
      </table>
    </div>
  );
};

export default App;