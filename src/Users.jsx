import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, "users");

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userList = Object.values(data); // convert object to array
        setUsers(userList);
      } else {
        setUsers([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const deleteUser = (uid) => {
    const db = getDatabase();
    remove(ref(db, "users/" + uid));
  };

  return (
    <div className="users-page">
      <h1>All Registered Users</h1>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>UID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.uid}>
                <td>{user.email}</td>
                <td>{user.uid}</td>
                <td>
                  <button className="delete-btn" onClick={() => deleteUser(user.uid)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
