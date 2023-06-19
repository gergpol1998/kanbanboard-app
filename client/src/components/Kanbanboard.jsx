import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './KanbanBoard.css';

function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    contact: ""
  })

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/task');
      setTasks(response.data);
      setFilteredTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = async (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const updatedTasks = tasks.map((task) => {
      if (task._id === taskId) {
        return { ...task, status: status, updatedAt: new Date().toISOString() };
      }
      return task;
    });

    try {
      await axios.put(`http://localhost:5000/task/update/${taskId}`, {
        status,
        updatedAt: new Date().toISOString()
      });
      setTasks(updatedTasks);
      applyFilter(filterStatus);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const applyFilter = (status) => {
    setFilterStatus(status);
    if (status === '') {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter((task) => task.status === status);
      setFilteredTasks(filtered);
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };
  

  const createNewTask = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/task/create', {
        title: newTask.title,
        description: newTask.description,
        contact: newTask.contact,
        status: 'pending',
      });

      setTasks([...tasks, response.data]);
      setFilteredTasks([...tasks, response.data]);
      clearTask();

    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const clearTask = () => {
    setNewTask({
      title: "",
      description: "",
      contact: ""
    })
  }

  const sortTasksByUpdatedAt = (a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-3">Kanbanboard</h1>
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Create Task */}
          <div className="create-task card mb-4">
            <div className="card-header">
              <h2>Create Task</h2>
            </div>
            <div className="card-body">
              <form onSubmit={createNewTask}>
                <div className="form-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Title"
                    name="title"
                    value={newTask.title}
                    onChange={handleOnChange}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Description"
                    name="description"
                    value={newTask.description}
                    onChange={handleOnChange}
                    required
                  ></textarea>
                </div>
                <div className="form-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contact"
                    name="contact"
                    value={newTask.contact}
                    onChange={handleOnChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Filter Buttons */}
      <div className="filter-buttons d-flex justify-content-center mb-3">
        <button className="btn btn-outline-secondary" onClick={() => applyFilter('')}>
          All
        </button>
        <button className="btn btn-outline-secondary" onClick={() => applyFilter('pending')}>
          Pending
        </button>
        <button className="btn btn-outline-secondary" onClick={() => applyFilter('accepted')}>
          Accepted
        </button>
        <button className="btn btn-outline-secondary" onClick={() => applyFilter('resolved')}>
          Resolved
        </button>
        <button className="btn btn-outline-secondary" onClick={() => applyFilter('rejected')}>
          Rejected
        </button>
      </div>
      <div className="row">
        {/* Pending Column */}
        <div className="col-md-3">
          <div
            className="column card mb-4"
            onDrop={(e) => handleDrop(e, 'pending')}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="card-header">
              <h2>Pending</h2>
            </div>
            <div className="card-body">
              {filteredTasks
                .filter((task) => task.status === 'pending')
                .sort(sortTasksByUpdatedAt)
                .map((task) => {
                  const createdAt = new Date(task.createdAt).toLocaleString('th-TH', {
                    timeZone: 'Asia/Bangkok'
                  });
                  return (
                    <div
                      key={task._id}
                      className="task card mb-3"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                    >
                      <div className="card-body">
                        <h5 className="card-title">{task.title}</h5>
                        <p className="card-text">{task.description}</p>
                        <p className="card-text">{task.contact}</p>
                        <hr />
                        <p className="card-text">Created At: {createdAt}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        {/* Accepted Column */}
        <div className="col-md-3">
          <div
            className="column card mb-4"
            onDrop={(e) => handleDrop(e, 'accepted')}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="card-header">
              <h2>Accepted</h2>
            </div>
            <div className="card-body">
              {filteredTasks
                .filter((task) => task.status === 'accepted')
                .sort(sortTasksByUpdatedAt)
                .map((task) => {
                  const createdAt = new Date(task.createdAt).toLocaleString('th-TH', {
                    timeZone: 'Asia/Bangkok'
                  });
                  const updatedAt = new Date(task.updatedAt).toLocaleString('th-TH', {
                    timeZone: 'Asia/Bangkok'
                  });
                  return (
                    <div
                      key={task._id}
                      className="task card mb-3"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                    >
                      <div className="card-body">
                        <h5 className="card-title">{task.title}</h5>
                        <p className="card-text">{task.description}</p>
                        <p className="card-text">{task.contact}</p>
                        <hr />
                        <p className="card-text">Created At: {createdAt}</p>
                        <p className="card-text">Updated At: {updatedAt}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        {/* Resolved Column */}
        <div className="col-md-3">
          <div
            className="column card mb-4"
            onDrop={(e) => handleDrop(e, 'resolved')}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="card-header">
              <h2>Resolved</h2>
            </div>
            <div className="card-body">
              {filteredTasks
                .filter((task) => task.status === 'resolved')
                .sort(sortTasksByUpdatedAt)
                .map((task) => {
                  const createdAt = new Date(task.createdAt).toLocaleString('th-TH', {
                    timeZone: 'Asia/Bangkok'
                  });
                  const updatedAt = new Date(task.updatedAt).toLocaleString('th-TH', {
                    timeZone: 'Asia/Bangkok'
                  });
                  return (
                    <div
                      key={task._id}
                      className="task card mb-3"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                    >
                      <div className="card-body">
                        <h5 className="card-title">{task.title}</h5>
                        <p className="card-text">{task.description}</p>
                        <p className="card-text">{task.contact}</p>
                        <hr />
                        <p className="card-text">Created At: {createdAt}</p>
                        <p className="card-text">Updated At: {updatedAt}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        {/* Rejected Column */}
        <div className="col-md-3">
          <div
            className="column card mb-4"
            onDrop={(e) => handleDrop(e, 'rejected')}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="card-header">
              <h2>Rejected</h2>
            </div>
            <div className="card-body">
              {filteredTasks
                .filter((task) => task.status === 'rejected')
                .sort(sortTasksByUpdatedAt)
                .map((task) => {
                  const createdAt = new Date(task.createdAt).toLocaleString('th-TH', {
                    timeZone: 'Asia/Bangkok'
                  });
                  const updatedAt = new Date(task.updatedAt).toLocaleString('th-TH', {
                    timeZone: 'Asia/Bangkok'
                  });
                  return (
                    <div
                      key={task._id}
                      className="task card mb-3"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                    >
                      <div className="card-body">
                        <h5 className="card-title">{task.title}</h5>
                        <p className="card-text">{task.description}</p>
                        <p className="card-text">{task.contact}</p>
                        <hr />
                        <p className="card-text">Created At: {createdAt}</p>
                        <p className="card-text">Updated At: {updatedAt}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KanbanBoard;
