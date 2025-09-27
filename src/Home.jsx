import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue, remove, update } from "firebase/database";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import firebase from "./firebase";
import Confetti from "react-confetti";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Home.css";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Track authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, []);

  // Fetch user tasks
  useEffect(() => {
    if (!user) return setTasks([]);
    const db = getDatabase(firebase);
    const tasksRef = ref(db, "tasks");
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const taskList = Object.entries(data)
          .map(([id, task]) => ({ id, ...task }))
          .filter((task) => task.createdBy === user.uid)
          .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        setTasks(taskList);
      } else setTasks([]);
    });
    return () => unsubscribe();
  }, [user]);

  // Delete task
  const deleteTask = (task) => {
    if (!user || task.createdBy !== user.uid)
      return toast.error("Unauthorized action!");
    const db = getDatabase(firebase);
    remove(ref(db, "tasks/" + task.id));
    toast.success("Task deleted!");
  };

  // Edit task
  const editTask = (task) => {
    if (!user || task.createdBy !== user.uid)
      return toast.error("Unauthorized action!");
    navigate("/add", { state: { task } });
  };

  // Toggle done
  const toggleDone = (task) => {
    if (!user || task.createdBy !== user.uid)
      return toast.error("Unauthorized action!");
    const db = getDatabase(firebase);
    update(ref(db, "tasks/" + task.id), { done: !task.done });
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.info("Logged out successfully!");
    } catch (err) {
      toast.error("Logout failed!");
    }
  };

  // Calculate completion percentage
  const total = tasks.length;
  const completed = tasks.filter((t) => t.done).length;
  const percentage = total ? Math.round((completed / total) * 100) : 0;

  // Animate progress
  useEffect(() => {
    let frame;
    let start = animatedPercent;
    let end = percentage;
    let startTime;
    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / 1000, 1);
      const eased =
        start + (end - start) * (0.5 - 0.5 * Math.cos(progress * Math.PI));
      setAnimatedPercent(Math.round(eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [percentage]);

  // Show confetti when 100% complete
  useEffect(() => {
    if (percentage === 100 && total > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [percentage, total]);

  return (
    <div className="home">
      {showConfetti && <Confetti recycle={false} numberOfPieces={400} />}
      <h1>TO-DO-LA</h1>
      <p>Set your goals, crush them, repeat.</p>

      <div className="auth-buttons">
        {user ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <button onClick={() => navigate("/signup")}>Signup</button>
            <button onClick={() => navigate("/login")}>Login</button>
          </>
        )}
      </div>

      <div className="progress-box">
        <div
          className={`progress-circle ${
            percentage === 100 ? "complete" : ""
          }`}
          style={{ "--progress": animatedPercent }}
        >
          <span>{animatedPercent}%</span>
        </div>
        <div className="progress-text">
          <p>
            You’ve completed <strong>{completed}</strong> out of{" "}
            <strong>{total}</strong> tasks.
          </p>
          <p className="progress-message">
            {percentage === 100
              ? "🎉 Congratulations! All tasks completed 🎉"
              : "You're halfway there! Keep it up!"}
          </p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <p className="no-tasks">
          <strong>You don’t have any tasks yet</strong>
          <br />
          Click on the + button to add one
        </p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={task.done ? "done" : ""}>
              {task.deadline && (
                <div className="task-deadline">
                  {new Date(task.deadline).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              )}
              {task.category && (
                <div className="task-category">{task.category}</div>
              )}
              <h3>{task.name}</h3>
              <p>{task.description}</p>
              <div className="task-buttons">
                {user && task.createdBy === user.uid && (
                  <>
                    <button
                      className="done-btn"
                      onClick={() => toggleDone(task)}
                    >
                      {task.done ? "Undo" : "Complete"}
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => editTask(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Floating Add Button */}
      <button
        className="fab"
        onClick={() => {
          if (user) {
            navigate("/add");
          } else {
            toast.info("Please login first to create a task !");
            setTimeout(() => navigate("/login"), 2000);
          }
        }}
      >
        +
      </button>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-center"
        autoClose={1500}
        theme="colored"
        closeButton={false}
        closeOnClick={false}
        draggable={false}
      />
    </div>
  );
};

export default Home;
