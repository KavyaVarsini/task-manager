import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/tasks");

        setTasks(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    if (task.trim() === "") return;

    const newTask = {
      text: task,
      completed: false,
    };

    try {
      await axios.post("http://localhost:5000/tasks", newTask);

      const response = await axios.get("http://localhost:5000/tasks");

      setTasks(response.data);
      setTask("");
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);

      const response = await axios.get("http://localhost:5000/tasks");

      setTasks(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleComplete = async (task) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${task._id}`, {
        text: task.text,
        completed: !task.completed,
      });

      const response = await axios.get("http://localhost:5000/tasks");

      setTasks(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const startEdit = (task) => {
    setEditId(task._id);
    setEditText(task.text);
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, {
        text: editText,
        completed: false,
      });

      const response = await axios.get("http://localhost:5000/tasks");

      setTasks(response.data);

      setEditId(null);
      setEditText("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-10">
      <h1 className="text-4xl font-bold mb-8 text-green-400">Task Tracker</h1>

      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Enter task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="px-4 py-2 rounded text-white w-80 bg-gray-800"
        />

        <button
          onClick={addTask}
          className="bg-green-500 px-6 py-2 rounded font-bold"
        >
          Add
        </button>
      </div>

      <div className="w-full max-w-md">
        {tasks.map((t) => (
          <div
            key={t._id}
            className="bg-gray-800 p-4 rounded mb-3 flex justify-between items-center"
          >
            {editId === t._id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="px-2 py-1 rounded bg-gray-700 text-white"
              />
            ) : (
              <span className={t.completed ? "line-through text-gray-500" : ""}>
                {t.text}
              </span>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => toggleComplete(t)}
                className="bg-blue-500 px-3 py-1 rounded"
              >
                Done
              </button>

              {editId === t._id ? (
                <button
                  onClick={() => saveEdit(t._id)}
                  className="bg-green-500 px-3 py-1 rounded"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => startEdit(t)}
                  className="bg-yellow-500 px-3 py-1 rounded"
                >
                  Edit
                </button>
              )}

              <button
                onClick={() => deleteTask(t._id)}
                className="bg-red-500 px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
