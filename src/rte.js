import {setActiveMenu,initializePage} from './display';
import {todoController} from './project';
import * as localStorageModule from './local-storage';


export function addNewProject(projectName){
    const newProject = todoController.addNewProject(projectName);
    updateLocalStorage();
    initializePage(newProject);
}

export function checkLocalStorageAvailability(){
    if (localStorageModule.storageAvailable("localStorage")) {
        return true;
    } 
    else {
        return false;
    }
}

export function getProject(){
    return todoController.getProjectsArray();
}


export function initializeTasklet(){
    localStorageModule.setTaskletFlag();
    addNewProject("General");
    initializePage();
}

export function checkFirstTimeUser(){
    if(localStorageModule.getTaskletFlag() === null)
        return true;
    else
        return false;
}

export function editTodoDetails(title, description, dueDate, priority,project,todo) {
    todoController.editTodoDetails(title, description, dueDate, priority, project, todo);
    updateLocalStorage();
    initializePage(project);
}

export function readLocalStorage(){
    const projects = localStorageModule.readLocalStorage();
    projects.forEach(project => {
        todoController.addExistingProject(project); 
    });
    initializePage();
}

export function updateLocalStorage(){
    localStorageModule.writeToStorage(todoController.getProjectsArray());
}

export function addNewTodo(project, title, des, dueDate, priority) {
    todoController.addNewTodo(project, title, des, dueDate, priority);
    updateLocalStorage();
}

export function setTodoStatus(done, project, todo) {
    todoController.setTodoStatus(done, project, todo);
    updateLocalStorage();
}

export function getTodoList(project) {
    updateLocalStorage();
    return todoController.getTodoList(project);
}

export function editProject(newName, project) {
    todoController.editProject(newName, project)
    updateLocalStorage();
    initializePage(project);
}

export function deleteProject(project) {
    todoController.deleteProject(project);
    updateLocalStorage();
}