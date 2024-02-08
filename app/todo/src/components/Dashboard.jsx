import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:3002");

const Dashboard = () => {
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const createTodo = async () => {
    const token = localStorage.getItem("token");
    await axios
      .post(
        "http://localhost:3001/todos",
        { title: title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const { _id, completed, title } = response.data;
        const newTodo = { _id, completed, title };
        setTitle("");
        const newTodos = [newTodo, ...todos];
        setTodos(newTodos);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const signOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  const deleteTodo = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:3001/todos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const newTodos = todos.filter((todo) => todo._id != id);
    setTodos(newTodos);
  };
  const deleteNotification = (index) => {
    const updatedNotifications = [...notifications];
    updatedNotifications.splice(index, 1);
    setNotifications(updatedNotifications);
  };
  const toggleCompleted = async (id, oldStatus) => {
    const token = localStorage.getItem("token");
    await axios
      .put(
        `http://localhost:3001/todos/${id}`,
        { completed: !oldStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        const updatedTodos = todos.map((todo) => {
          if (todo._id === id) {
            return { ...todo, completed: !oldStatus }; // Toggle completed status locally
          }
          return todo;
        });
        setTodos(updatedTodos); // Set the updated todos state
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    const fetchTodos = async () => {
      try {
        const response = await axios.get("http://localhost:3001/todos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTodos(response.data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    const setupSocket = () => {
      console.log("start not");
      socket.on("notification", (notification) => {
        console.log(notification);
        if (notification.message) {
          setNotifications((prevNotifications) => [
            notification.message,
            ...prevNotifications,
          ]);
        }
      });
      console.log("Socket connected:", socket.connected);
    };
    if (localStorage.getItem("token") != undefined) {
      fetchTodos();
      setupSocket();
    } else {
      window.location.href = "/";
    }
    return () => {
      socket.off("notification");
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        margin: "0px",
        padding: "0px",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: "50px",
          left: "100px",
          width: "20%",
          border: "1px solid white",
          borderRadius: "5px",
          padding: "15px",
        }}
      >
        <h2>New Item</h2>
        <label style={{ fontSize: "20px" }}>Item </label>
        <input
          style={{ height: "20px", fontSize: "20px" }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <br />
        <button
          style={{ cursor: "pointer" }}
          onClick={() => {
            createTodo();
          }}
        >
          <h2 style={{ fontSize: "15px" }}>Add</h2>
        </button>
      </div>
      <div style={{ width: "5%" }}></div>
      <div
        style={{
          top: "50px",
          position: "absolute",
          left: "500px",
          width: "20%",
          border: "1px solid white",
          borderRadius: "5px",
          padding: "15px",
        }}
      >
        <h2>Grocery list</h2>
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {todos &&
            todos.map((todo) => {
              return (
                <div
                  key={todo._id}
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    marginBottom: "10px",
                    padding: "10px",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className={todo.completed ? "todo completed" : "todo"}
                      style={{
                        cursor: "pointer",
                        width: "80%",
                        padding: "10px",
                        border: "1px solid",
                      }}
                      onClick={() => toggleCompleted(todo._id, todo.completed)}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          justifyItems: " center",
                          alignItems: "center",
                        }}
                      >
                        {todo.title}
                        {todo.completed == true ? (
                          <i
                            className="fa-regular fa-square-check"
                            style={{ fontSize: "20px" }}
                          ></i>
                        ) : (
                          <i
                            className="fa-regular fa-square"
                            style={{ fontSize: "20px" }}
                          ></i>
                        )}
                      </div>
                    </div>
                    <i
                      onClick={() => {
                        deleteTodo(todo._id);
                      }}
                      className="fa-solid fa-xmark"
                      style={{ marginLeft: "10px", cursor: "pointer" }}
                    ></i>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          top: "50px",
          left: "900px",
          width: "20%",
          border: "1px solid white",
          borderRadius: "5px",
          padding: "15px",
        }}
      >
        <h2>Notifications</h2>
        {notifications &&
          notifications.map((notification, index) => {
            return (
              <div
                key={`${Math.random()}${notification}+${Math.random()}`}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "80%",
                    borderRadius: "5px",
                    marginTop: "10px",
                    marginBottom: "10px",
                    padding: "10px",
                    alignItems: "center",
                    backgroundColor: "#C77B7B",
                  }}
                >
                  {notification}
                </div>
                <i
                  onClick={() => {
                    deleteNotification(index);
                  }}
                  className="fa-solid fa-xmark"
                  style={{ marginLeft: "10px", cursor: "pointer" }}
                ></i>
              </div>
            );
          })}
      </div>
      <h2
        style={{
          position: "fixed",
          top: "60px",
          left: "1400px",
          width: "20%",
          cursor: "pointer",
          color: "#0390fc",
        }}
        onClick={() => {
          signOut();
        }}
      >
        Sign out from this grocery list
      </h2>
    </div>
  );
};

export default Dashboard;
