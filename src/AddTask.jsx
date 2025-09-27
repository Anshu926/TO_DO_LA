import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getDatabase, ref, push, set } from "firebase/database";
import { auth } from "./firebase";
import firebase from "./firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddTask.css";

const AddTask = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const taskToEdit = location.state?.task;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setName(taskToEdit.name || "");
      setDescription(taskToEdit.description || "");
      setDeadline(taskToEdit.deadline || "");
      setCategory(taskToEdit.category || "");
    }
  }, [taskToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const db = getDatabase(firebase);
    const currentUser = auth.currentUser;

    if (!currentUser) {
      toast.error("⚠️ You must be logged in to add a task!");
      navigate("/login");
      return;
    }

    if (!name.trim() || !category.trim()) {
      toast.warn("⚠️ Please fill in all required fields!");
      return;
    }

    if (taskToEdit) {
      if (taskToEdit.createdBy !== currentUser.uid) {
        toast.error("❌ Unauthorized: You can only edit your own tasks!");
        return;
      }

      set(ref(db, "tasks/" + taskToEdit.id), {
        name,
        description,
        deadline,
        category,
        createdBy: taskToEdit.createdBy,
        done: taskToEdit.done || false,
      })
        .then(() => {
          toast.success("Task updated successfully!");
          setTimeout(() => navigate("/home"), 2000);
        })
        .catch(() => toast.error("❌ Failed to update task."));
    } else {
      const newTaskRef = push(ref(db, "tasks"));
      set(newTaskRef, {
        name,
        description,
        deadline,
        category,
        createdBy: currentUser.uid,
        done: false,
      })
        .then(() => {
          toast.success(" Task created successfully!");
          setTimeout(() => navigate("/home"), 2000);
        })
        .catch(() => toast.error("❌ Failed to create task."));
    }
  };

  return (
    <div>
      <div className="add-task">
        <h2>{taskToEdit ? "Update Task" : "Add New Task"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Task Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <div className="select-wrapper">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category *</option>
              <option value="Work">Work</option>
              <option value="Study">Study</option>
              <option value="Personal">Personal</option>
              <option value="Fitness">Fitness</option>
            </select>
          </div>
          <button type="submit">
            {taskToEdit ? "Update Task" : "Create Task"}
          </button>
        </form>
      </div>

      {/* ✅ Toast Notifications are now separate */}
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="colored"
        closeButton={false}
        toastStyle={{
          width: "350px",
          fontSize: "14px",
        }}
        style={{
          position: "fixed", // ✅ Always float
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999, // ✅ stays above form
        }}
      />
    </div>
  );
};

export default AddTask;
