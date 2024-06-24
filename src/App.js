import { useState, useEffect, useRef } from "react";
import "./App.css";
import { MdDelete } from "react-icons/md";
import { FaCircleCheck } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";

function useKey(key, cb) {
  const callbackRef = useRef(cb);
  useEffect(() => {
    callbackRef.current = cb;
  });
  useEffect(() => {
    function handle(event) {
      if (event.code === key) {
        callbackRef.current(event);
      }
    }
    document.addEventListener("keypress", handle);
    return () => document.removeEventListener("keypress", handle);
  }, [key]);
}

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState("");
  const [currentEditedItem, setCurrentEditedItem] = useState("");

  const handleAddTodo = () => {
    let newTodoItem = {
      title: newTitle,
      description: newDescription,
    };
    let updatedTodoArr = [...allTodos];

    if ((newTodoItem.title && newTodoItem.description) !== "") {
      updatedTodoArr.push(newTodoItem);
      setTodos(updatedTodoArr);
      localStorage.setItem("todolist", JSON.stringify(updatedTodoArr));
      setNewTitle("");
      setNewDescription("");
      console.log(newTodoItem);
    } else {
      alert(`Please add Your ToDo task with Title and Description`);
    }
  };

  const handleDeleteTodo = (index) => {
    let reducedTodo = [...allTodos];
    reducedTodo.splice(index, 1);

    localStorage.setItem("todolist", JSON.stringify(reducedTodo));
    setTodos(reducedTodo);
  };

  const handleComplete = (index) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let hrs = now.getHours();
    let min = now.getMinutes();
    let sec = now.getSeconds();
    let completedOn =
      dd + "-" + mm + "-" + yyyy + " at " + hrs + ":" + min + ":" + sec;

    let filteredItem = {
      ...allTodos[index],
      completedOn: completedOn,
    };

    let updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push(filteredItem);
    setCompletedTodos(updatedCompletedArr);
    handleDeleteTodo(index);
    localStorage.setItem("completedTodos", JSON.stringify(updatedCompletedArr));
  };

  const handleDeleteCompletedTodo = (index) => {
    let reducedTodo = [...completedTodos];
    reducedTodo.splice(index, 1);

    localStorage.setItem("completedTodos", JSON.stringify(reducedTodo));
    setCompletedTodos(reducedTodo);
  };

  useEffect(() => {
    let savedTodo = JSON.parse(localStorage.getItem("todolist"));
    let savedCompletedTodo = JSON.parse(localStorage.getItem("completedTodos"));
    if (savedTodo) {
      setTodos(savedTodo);
    }

    if (savedCompletedTodo) {
      setCompletedTodos(savedCompletedTodo);
    }
  }, []);

  const handleEdit = (index, item) => {
    setCurrentEdit(index);
    setCurrentEditedItem(item);
  };

  const handleUpdateTitle = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, title: value };
    });
  };

  const handleUpdateDescription = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, description: value };
    });
  };

  const handleUpdateTodo = () => {
    let newTodo = [...allTodos];
    newTodo[currentEdit] = currentEditedItem;
    setTodos(newTodo);
    setCurrentEdit("");
  };

  useKey("Enter", handleAddTodo);

  return (
    <>
      <div className="App">
        <h1>My Todos</h1>
        <div className="todo-wrapper">
          <div className="todo-input">
            <div className="todo-input-item">
              <label>Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="What's your todo task"
              ></input>
            </div>
            <div className="todo-input-item">
              <label>Description</label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Describe your task"
              ></input>
            </div>
            <div className="todo-input-item">
              <button
                type="button"
                onClick={handleAddTodo}
                className="primaryBtn"
              >
                Add
              </button>
            </div>
          </div>
          <div className="btn-area">
            <button
              className={`secondaryBtn ${
                isCompleteScreen === false && "active"
              }`}
              onClick={() => setIsCompleteScreen(false)}
            >
              Todo
            </button>
            <button
              className={`secondaryBtn ${
                isCompleteScreen === true && "active"
              }`}
              onClick={() => setIsCompleteScreen(true)}
            >
              Completed
            </button>
          </div>
          <div className="todo-list">
            {isCompleteScreen === false &&
              allTodos.map((item, index) => {
                if (currentEdit === index) {
                  return (
                    <div className="edit__wrapper" key={index}>
                      <input
                        placeholder="Updated Title"
                        onChange={(e) => handleUpdateTitle(e.target.value)}
                        value={currentEditedItem.title}
                      ></input>
                      <textarea
                        placeholder="Updated Title"
                        rows={4}
                        onChange={(e) =>
                          handleUpdateDescription(e.target.value)
                        }
                        value={currentEditedItem.description}
                      ></textarea>
                      <button
                        type="button"
                        onClick={handleUpdateTodo}
                        className="primaryBtn"
                      >
                        Update
                      </button>
                    </div>
                  );
                } else {
                  return (
                    <div className="todo-list-item" key={index}>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                      <div>
                        <MdDelete
                          className="icon"
                          title="Delete"
                          onClick={() => handleDeleteTodo(index)}
                        />
                        <FaCircleCheck
                          className="check-icon"
                          title="Completed?"
                          onClick={() => handleComplete(index)}
                        />
                        <CiEdit
                          className="check-icon"
                          title="Edit?"
                          onClick={() => handleEdit(index, item)}
                        />
                      </div>
                    </div>
                  );
                }
              })}

            {isCompleteScreen === true &&
              completedTodos.map((item, index) => {
                return (
                  <div className="todo-list-item" key={index}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <p>
                        <small>Completed On: {item.completedOn}</small>
                      </p>
                    </div>
                    <div>
                      <MdDelete
                        className="icon"
                        title="Delete"
                        onClick={() => handleDeleteCompletedTodo(index)}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div className="footer">
        <p>
          Created By &nbsp;
          <a
            href="https://github.com/Mohit138928"
            target="_blank"
            rel="noreferrer"
          >
            Mohit Maurya
          </a>
          <FaHeart className="heart" />
        </p>
      </div>
    </>
  );
}

export default App;
