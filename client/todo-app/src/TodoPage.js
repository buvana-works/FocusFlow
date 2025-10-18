import { useState, useEffect } from "react";
import axios from "axios";           
import './TodoPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  
import { faEdit, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import ReactSelect from 'react-select';
import { formatDateFunction } from "./utils";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import AuthPage from "./AuthPage";

// const todoArray = [
//   {
//     id: "1",
//     date: "2025-06-20",
//     description: "To go to bank",
//     status:        
//   },
//   {
//     id: "2",
//     date: "2025-06-22",
//     description: "go to post office",
//     status: false
//   },
//   {
//     id: "3",
//     date: "2025-06-24",     
//     description: "Bike service",
//     status: false
//   } 
// ]

const optionsArray = [
  {label:"Pending", value:"Pending"},
  {label:"Done", value:"Done"}
]

const priorityLevels = [
  {label:"High", value:"High"},
  {label:"Medium", value:"Medium"},
  {label:"Low", value:"Low"}
]

    const categories = [
      {label: "Work", value: "Work"},
      {label: "Personal", value: "Personal"},
      {label: "Billing", value: "Billing"}
    ]

const initTodo = { id: "", date: "", description: "", status: false, dueDate:"", priority:"", category:"" };

function TodoApp() {

 
  const [listTodos, setListTodos] = useState([initTodo]);
  const [todo, setTodo] = useState(initTodo);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedState, setSelectedState] = useState();
  const [selectedPriority, setSelectedPriority] = useState();
  const [selectedCategory, setSelectedCategory] = useState();    
  const [filterredArray, setFilterredArray] =  useState();
  const [filterDueDate, setFilterDueDate] = useState();
  const [filterPriority, setFilterPriority] = useState();
  const [filterCategory, setFilterCategory] = useState();
  const [filterStatus, setFilterStatus] =useState();
  const [token, setToken] = useState();
  const [activeTab, setActiveTab] = useState("login");
  const tokenFetched = localStorage.getItem("accessToken");   


  const listTodoFun = async () => {
    return await axios.get("http://localhost:5000/todo/listTodo").then((res) => {
      console.log("the response is here:", res.data);
      return res.data;
    }).catch((error) => {
      console.log("error message", error);
     
    })
  }


  axios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  console.log("access token fetched", accessToken)
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      try {
        const res = await axios.post("http://localhost:5000/auth/refresh", { token: refreshToken });
        localStorage.setItem("accessToken", res.data.accessToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`;
        return axios(originalRequest); // retry the failed request
      } catch (err) {
        console.error("Refresh token failed:", err);
        // optionally redirect to login
      }
    }
    return Promise.reject(error);
  }
);

useEffect(()=>{
setToken(tokenFetched);
},[tokenFetched])

  const createTodo = async (input) => {
    return await axios.post("http://localhost:5000/todo/createTodo", input).then((res) => {
      console.log("todo created successfully", res.data);
      toast.success("Todo created successfully");
      return res.data;
    })
      .catch((err) => {
        console.log("error at create Todo", err);
        toast.error("Error at create Todo") 
      })
  }

  const deletedTodo = async (id) => {
    return await axios.delete(`http://localhost:5000/todo/deleteTodo/${id}`).then((res) => {
      console.log("todo deleted successfully", res.data);
      toast.success("Todo deleted successfully");
      return res.data;
    })
      .catch((err) => {
        toast.success("Error at delete todo");
        console.log("error at delete todo", err);
      })
  }

  const updateTodo = async (input) => {
    console.log("input given to update", input);
    return await axios.put(`http://localhost:5000/todo/updateTodo/${input._id}`, input).then((res) => {
      console.log("todo updated successfully", res.data);
      toast.success("Todo updated successfully")
      return res.data;
    })
      .catch((err) => {
       toast.success("Error at update Todo");
        console.log("error at update Todo", err);
      })
  }

  useEffect(() => {
    console.log("current date", new Date());
    console.log("app is renderring in new");
    const fetchTodos = async () => {
      const getRes = await listTodoFun();
      console.log("getRes", getRes);
      if(getRes){
        const sortedTodo = getRes.sort((a,b) => {
          return new Date(a.dueDate) - new Date(b.dueDate);
        })
        setListTodos(sortedTodo);
        setFilterredArray(sortedTodo);
      }
    };

    fetchTodos();
    console.log("This is my new console");
  }, []);

  const handleSearch = () =>{

    console.log("filter status", filterStatus);

    const filterredList = listTodos.filter((x)=>{
      const dueDateOnly = dateOnly(x.dueDate);
      const filteredDateOnly = dateOnly(filterDueDate);
      const dueDateResult = filterDueDate ? dueDateOnly === filteredDateOnly : true;
      const statusBooleanValue = filterStatus && filterStatus.value && filterStatus.value === "Done" ? true : false;
      const statusResult = filterStatus && filterStatus.value ? x.status === statusBooleanValue : true;
      const priorityResult =filterPriority && filterPriority.value ? x.priority === filterPriority.value : true;
      const categoryResult =filterCategory && filterCategory.value ? x.category === filterCategory.value : true;

      return dueDateResult && statusResult && priorityResult && categoryResult
    }
  )

  setFilterredArray(filterredList);

  }

  const handleDeleteTodo = (id) => {
    console.log("inside deleted todo", id);
    const filterredTodo = listTodos.filter((x) => (x._id !== id));
    console.log("filterredTodo", filterredTodo);
    setListTodos(filterredTodo);
    deletedTodo(id);
  }

  const handleMarkAsDone = (id) => {
    console.log("id in mark as done", id);
    const indexOfTodo = listTodos.findIndex((x) => x._id === id);
    const todos = [...listTodos]; // create a new array
    const oldTodo = listTodos[indexOfTodo];
    const changedTodo = { ...oldTodo, status: true };
    updateTodo(changedTodo);
    todos[indexOfTodo] = changedTodo;
    console.log("after chage todo", todos);
    setListTodos(todos);
  }



  const handleSubmit = async (event) => {
    event.preventDefault();
    const currentDate = formatDateFunction(new Date());
    console.log("current date in submit", currentDate)
    console.log("handleSubmit called in submit", todo);
    if (todo._id && todo._id !== "") {   
      console.log("inside update section", todo);
      const indexOfTodo = listTodos.findIndex((x) => x._id === todo._id);
      const todos = [...listTodos]; // create a new array
      todos[indexOfTodo] = todo;
      setListTodos(todos);
      await updateTodo(todo);
    }
    else {
      console.log("inside create section", todo);
      const data = { ...todo, status: false, date:currentDate };
      const todoData = [...listTodos, data];
      console.log("todoData", todoData);
      setListTodos(todoData);
      const createRes = await createTodo(data);
      console.log("create response", createRes);
    }
  }

  const handleEdit = (id) => {
    console.log("edit item id", id);
    const selectedItem = listTodos.find((x) => x._id === id);
    console.log("found item", selectedItem);
    setTodo(selectedItem);
    setIsEdit(true);
    const status = selectedItem.status ? "Done" : "Pending"
    setSelectedState({label:status , value:status});
    setSelectedPriority({label:selectedItem.priority , value:selectedItem.priority});
    setSelectedCategory({label:selectedItem.category, value: selectedItem.category});

  }

  const handleStatusChange = (e) =>{
    console.log("select event", e);
    const status = e.value === "Done" ? true : false;
    setTodo({ ...todo, status: status });
    setSelectedState({label:e.value, vlaue:e.value});

  }
 
    const handlePriorityChange = (e) =>{
    console.log("select event", e);
    setTodo({ ...todo, priority: e.value });
    setSelectedPriority({label:e.value, vlaue:e.value});

  }


  const handleCategoryChange = (e) =>{
    console.log("select event", e);
    setTodo({ ...todo, category: e.value });
    setSelectedCategory({label:e.value, vlaue:e.value});

  }
  
  const handleClear = () => {
    setTodo(initTodo);
    setSelectedCategory(null);
    setSelectedPriority(null);
    setSelectedState(null);
    
    
  }

    const handleClearSearch = () => {
    setFilterCategory(null);
    setFilterPriority(null);
    setFilterStatus(null);
    setFilterDueDate("");
    setFilterredArray(listTodos);
  }

  const dateOnly = (givenDate) =>{
  const date = new Date(givenDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
  }

  const formatDateTime = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const isOverDue = (givenDueDate) => {
const currentDate = new Date();
const dueDate = new Date(givenDueDate);
return currentDate > dueDate;

}

  return (
    <div className="App">
{ token ? (<div><ToastContainer />
      <form className="todo-form" onSubmit={handleSubmit}>
        <label>Due Date</label>
        <input
          type="datetime-local"          
          value={todo.dueDate}
          onChange={(e => setTodo({ ...todo, dueDate: e.target.value }))}
        />
        <label>Description</label>
        <input
          type="text"
          value={todo.description}
          onChange={(e => setTodo({ ...todo, description: e.target.value }))}
        /> 
        <label>Priority</label> 
        <ReactSelect
        options={priorityLevels}
        value={selectedPriority}
        onChange={(e)=>handlePriorityChange(e)}
        />
        <label>Category</label> 
        <ReactSelect
        options={categories}
        value={selectedCategory}
        onChange={(e)=>handleCategoryChange(e)}
        />
         { isEdit ? <> <label>Status</label>
         <ReactSelect
         options={optionsArray}
         onChange={(e)=> handleStatusChange(e)}
         value={selectedState}
         />
      </> : <></>}
        <div className="todo-form-buttons">
          <button type="submit">Submit</button>
          <button type="button" onClick={handleClear}>Clear</button>
        </div>
      </form>

 <div className="filters-container">

  <div className="filter-block">
    <label>Due Date</label>
    <input
      type="date"
      value={filterDueDate}
      onChange={(e) => setFilterDueDate(e.target.value)}
    />
  </div>

  <div className="filter-block">
    <label>Priority</label>
    <ReactSelect
      options={priorityLevels}
      value={filterPriority}
      onChange={(e) => setFilterPriority({label:e.value, value:e.value})}
    />
  </div>

  <div className="filter-block">
    <label>Category</label>
    <ReactSelect
      options={categories}
      value={filterCategory}
      onChange={(e) => setFilterCategory({label:e.value, value:e.value})}
    />
  </div>

  <div className="filter-block">
    <label>Status</label>
    <ReactSelect
      options={[...optionsArray, {label:"Overdue", value:"Overdue"}]}
      value={filterStatus}
      onChange={(e) => setFilterStatus({label:e.value, value:e.value})}
    />
  </div>
    <div>
    <button type="button" className="search-button" onClick={handleSearch}>Search</button>
  </div>

  <div>
    <button type="button" className="clear-search-button" onClick={handleClearSearch}>Clear</button>
  </div>

</div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
             <th>Due Date</th>
            <th>Description</th>
            <th>Priority</th>
            <th>Category</th>
            <th>Status</th>
            <th>Edit</th>
            <th>Mark as Done</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {
            filterredArray?.map((x) => (
              x._id ? (<tr key={x._id} className={x.priority === "High" ? "tr-red" : ""}>
                <td>{x.date}</td>
                <td>{formatDateTime(x.dueDate)}</td>
                <td>{x.description}</td>
                <td>{x.priority}</td>
                <td>{x.category}</td>
                <td>{isOverDue(x.dueDate) ? "Overdue" : x.status ? "Done" : "Pending"}</td>
                <td>{<FontAwesomeIcon onClick={() => { handleEdit(x._id) }} icon={faEdit} />}</td>
                <td>{!x.status ? <button className="mark-button" onClick={() => { handleMarkAsDone(x._id)}}>Mark</button> : <button className="done-button"><FontAwesomeIcon style={{color:"white"}} icon={faCheck} /></button>}</td>
                <td>{<FontAwesomeIcon onClick={() => { handleDeleteTodo(x._id) }} icon={faTrash} />}</td>
              </tr>) : null
            ))
          }
        </tbody>

      </table>
      </div> 
      )
 :
     <AuthPage setAuth={setToken} />
}
      </div>
  )

}

export default TodoApp;


// <td>{!x.status && <FontAwesomeIcon onClick={() => { handleMarkAsDone(x._id) }} icon={faCheck} />}</td>

  // (<div className="auth-container">
  //       <div className="tab-buttons">
  //         <button
  //           className={activeTab === "login" ? "active" : ""}
  //           onClick={() => setActiveTab("login")}
  //         >
  //           Login
  //         </button>
  //         <button
  //           className={activeTab === "signup" ? "active" : ""}
  //           onClick={() => setActiveTab("signup")}
  //         >
  //           Signup
  //         </button>
  //       </div>

  //       <div className="tab-content">
  //         {activeTab === "login" ? (
  //           <Login setAuth={setToken} />
  //         ) : (
  //           <Signup onSignupSuccess={() => setActiveTab("login")} />
  //         )}
  //       </div>
  //     </div>)
