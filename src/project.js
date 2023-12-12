const todoController = (function(){
    const projects = [];
    function addNewProject(projectName){
        const newProject = new Project(projectName);
        projects.push(newProject);
        return newProject;
    }

    function addExistingProject(localStorageProject) {
        const newProject = new Project(localStorageProject.projectName);
        projects.push(newProject);
        const todos = localStorageProject.todos;
        todos.forEach(todo => {
            newProject.addNewTodo(todo.title,todo.description,todo.dueDate,todo.priority,todo.status);
        });
    }

    function editTodoDetails(title, description, dueDate, priority, project,todo) {
        project.editTodoDetails(title, description, dueDate, priority, todo);
    }

    function getProjectsArray(){
        return projects;
    }

    function addNewTodo(project,title,description,dueDate,priority) {
        project.addNewTodo(title,description,dueDate,priority)
    }

    function getTodoList(project) {
        return project.getTodoList();
    }

    function setTodoStatus(done, project, todo) {
        project.setStatus(todo, done);
    }

    function editProject(newName, project) {
        project.setNewName(newName);
    }

    function deleteProject(project) {
        const index = projects.indexOf(project);
        projects.splice(index, 1);
        console.log(projects);
    }

    return { addNewProject, getProjectsArray, addNewTodo, getTodoList, setTodoStatus, editProject, deleteProject, addExistingProject, editTodoDetails };
})();


class Project {
    constructor(projectName){
        this.projectName = projectName;
        this.todos = [];
    }
    getProjectName(){
        return this.projectName;
    }
    addNewTodo(title,description,dueDate,priority,status = false){
        const newTodo = new Todo(title,description,dueDate,priority,status)
        this.todos.push(newTodo);
    }
    getTodoCount(){
        return this.todos.length;
    }

    getTodoList() {
        return this.todos;
    }
    setStatus(todo, done) {
        todo.setStatus(done);
    }
    setNewName(name) {
        this.projectName = name;
    }
    editTodoDetails(title, description, dueDate, priority, todo) {
        todo.editTodoDetails(title, description, dueDate, priority);
    }
}

class Todo{
    constructor(title,description,dueDate,priority,status){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status;
    }
    getTitle() {
        return this.title;
    }

    getDescription() {
        return this.description;
    }

    getDueDate() {
        return this.dueDate;
    }

    getPriority() {
        return this.priority;
    }

    getStatus() {
        return this.status;
    }
    setStatus(done) {
        this.status = done;
    }
    editTodoDetails(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }
}



export {todoController};