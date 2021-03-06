import React, {Component} from 'react';
import Pagination from "react-js-pagination";
// require("bootstrap/less/bootstrap.less");

class App extends Component {

    constructor() {
        super();
        this.state = {
            title: '',
            description: '',
            tasks: [],
            _id: '',
            activePage: 1,
            page: 1,
            pages: 1
        };
        this.addTask = this.addTask.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handlePageChange(pageNumber) {
        fetch(`http://localhost:3000/api/tasks/pagination/${pageNumber}`)
            .then(res => res.json())
            .then(data => {
                const { tasks, page, pages} = data;
                this.setState({tasks, page, pages});
                console.log(data); 
            });

        console.log(`active page is ${pageNumber}`);
        this.setState({activePage: pageNumber});
      }

    addTask(e) {
        if(this.state._id) {
            fetch(`http://localhost:3000/api/tasks/${this.state._id}`, {
                method: 'PUT',
                body: JSON.stringify(this.state),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                M.toast({html: 'Task Updated'});
                this.setState({title: '', description: '', _id: ''});
                // this.fetchTask();
                this.handlePageChange(this.state.page);
            });

        } else {
            fetch('http://localhost:3000/api/tasks', {
                method: 'POST',
                body: JSON.stringify(this.state),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    M.toast({html: 'Task Saved'});
                    this.setState({title: '', description: ''});
                    // this.fetchTask();
                    this.handlePageChange(this.state.page);
                })
                .catch(err => console.error(err));

        }

        e.preventDefault();
    }

    componentDidMount() {
        // this.fetchTask();
        this.handlePageChange(1);
    }

    fetchTask() {
        fetch('http://localhost:3000/api/tasks')
            .then(res => res.json())
            .then(data => {
                this.setState({tasks: data});
                console.log(this.state.tasks); 
            });
    }

    deleteTask(id) {
        if(confirm('Are you sure that you want to delete the task?')) {
            fetch(`http://localhost:3000/api/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                M.toast({html: 'Task Deleted'});
                // this.fetchTask();
                this.handlePageChange(this.state.page);
            });
        }
    }

    updateTask(id) {
        fetch(`http://localhost:3000/api/tasks/${id}`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                this.setState({
                    title: data.title,
                    description: data.description,
                    _id: data._id
                })
            });
    }

    handleChange(e){
        const { name, value} = e.target;
        this.setState({
            [name]: value
        });
    }

    render() {
        return(
            <div>
                {/* NAVIGATION */}
                <nav className="light-blue darken-4">
                    <div className="container">
                        <a className="brand-logo" href="/">MERN STACK</a>
                    </div>
                </nav>

                <div className="container">
                    <div className="row">
                        <div className="col s5">
                            <div className="card">
                                <div className="card-content">
                                    <form onSubmit={this.addTask}>
                                        <div className="row">
                                            <div className="input-field col s12">
                                                <input name="title" onChange={this.handleChange} type="text" placeholder="Task Title" value={this.state.title}></input>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="input-field col s12">
                                               <textarea name="description" onChange={this.handleChange} placeholder="Task Description" className="materialize-textarea" value={this.state.description}></textarea>
                                            </div>
                                        </div>
                                        <button type="submit" className="btn light-blue darken-4">SEND</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col s7">
                            <table>
                                <thead>
                                    <tr>
                                       <th>Title</th> 
                                       <th>Description</th>
                                       <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.tasks.map(task => {
                                            return (
                                                <tr key={task._id}>
                                                    <td>{task.title}</td>
                                                    <td>{task.description}</td>
                                                    <td>{task.date}</td>
                                                    <td>
                                                        <button className="bnt light-blue darken-4" onClick={() => this.updateTask(task._id)}>
                                                            <i className="material-icons">edit</i>
                                                        </button>
                                                        <button className="bnt light-blue darken-4" onClick={() => this.deleteTask(task._id)}>
                                                        <i className="material-icons">delete</i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            <Pagination
                                activePage={this.state.activePage}
                                itemsCountPerPage={5}
                                totalItemsCount={450}
                                pageRangeDisplayed={5}
                                onChange={i => this.handlePageChange(i)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;