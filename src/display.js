import { getProject, addNewProject, addNewTodo, getTodoList, setTodoStatus, editProject, deleteProject, editTodoDetails } from "./rte";
import { format, startOfToday, startOfDay, isBefore,differenceInSeconds } from "date-fns";
import EditGrey from "./remove-grey.svg"
import EditBlack from "./remove-black.svg"
import EditRed from "./remove-red.svg"
import AddBlack from "./add-black.svg"
import AddGrey from "./add-grey.svg"
import AddRed from "./add-red.svg"
import { todoController } from "./project";

function createWithClass(elementType, className,textContent = ""){
    let newElement = document.createElement(elementType);
    newElement.classList.add(className);
    newElement.textContent = textContent;
    return newElement;
}


function createWithId(elementType, idName){
    let newElement = document.createElement(elementType);
    newElement.id = idName;
    return newElement;
}

function setActiveMenu(menuToSet){
    setSelectedClass(menuToSet);
}

function setSelectedClass(menuToSet){
    const sideOptions = document.querySelectorAll(".side-options");
    sideOptions.forEach(sideOption => {
        sideOption.classList.remove("selected");
    });
    const option = document.querySelector(`#${menuToSet}`);
    option.classList.add("selected");

    
}
function initializePage(project = "today"){
    //generate project names in sidebar
    generateUpcomingEventListeners();
    generateSideBarOptions(project);

    


    const sideOptions = document.querySelectorAll(".side-options");
    const modalToShow = document.querySelector("#dialog-modal");

    //setting event listeners to side options
    sideOptions.forEach(sideOption=>{
        sideOption.addEventListener("click",()=>{
            
        })
    });

    //setting event listener to add project button
    const addProjectButton = document.querySelector(".add-project-button");
    addProjectButton.addEventListener("click",()=>{
        generateAddProjectModal(2);
        modalToShow.showModal();
    });

    if (project === "today") {
        document.querySelector("#today").click();
    }
}

function generateAddProjectModal(count,project=""){
    const dialog = document.querySelector("#dialog-modal");
    dialog.textContent = "";
    dialog.class = "center";
    dialog.classList.add("add-project-modal");
    let form = document.createElement("form");
    form.id = "project-entry-modal"
    const header = createWithClass("h2","title-add-project");
    header.textContent = "New Project";
    form.appendChild(header);
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter new project name";
    form.appendChild(input);
    form.appendChild(generateFormButtonSection(count));
    dialog.appendChild(form);
    const addProjectButton = document.querySelector("#add-button");
    addProjectButton.addEventListener("click",(event)=>{
        event.preventDefault();
        if (count === 2)
            addNewProject(input.value);
        else
            editProject(input.value, project);
        // initializePage();
        dialog.close();
    })
}

function generateFormButtonSection(count){
    const formButtonSection = createWithClass("div","form-buttons-section");
    const submitButton = createWithId("button","submit-button");
    submitButton.textContent = "Save";
    submitButton.id = "add-button";
    formButtonSection.appendChild(submitButton);
    if(count === 3){
        const deleteButton = createWithId("button","delete-button");
        deleteButton.textContent = "Delete";
        formButtonSection.appendChild(deleteButton);
    }
    const cancelButton = document.createElement("button");
    cancelButton.value = "cancel";
    cancelButton.formMethod = "dialog";
    cancelButton.textContent = "Cancel";
    formButtonSection.appendChild(cancelButton);
    return formButtonSection;
}

function generateDisplayForProject(project){
    const display = document.querySelector(".display-area");
    const dialog = document.querySelector("#dialog-modal");
    display.textContent = "";
    if(project.getTodoCount() === 0){
        const displayArea = createWithClass("div","display-area-no-task");
        displayArea.appendChild(createWithClass("div","page-heading",project.getProjectName()));
        let buttonArea = createWithClass("div","button-area");
        let addButtonContainer = createWithClass("div","add-button-container");
        let addButtonSet = createWithClass("div","add-button-set");
        let img = createWithClass("img","add-icon");
        img.src = AddBlack;
        img.alt = "+";
        addButtonSet.appendChild(img);
        addButtonSet.appendChild(createWithClass("div","add-text","Add a task"));
        addButtonSet.addEventListener("mouseover",()=>{
            img.src = AddGrey;
        });
        addButtonSet.addEventListener("mouseout",()=>{
            img.src = AddBlack;
        });
        addButtonSet.addEventListener("click",()=>{
            generateAddEditTodoModal();
            const addButton = document.querySelector("dialog #add-button");
            addButton.addEventListener("click", (event) => {
                event.preventDefault();
                let title = document.querySelector("#todo-title").value;
                let des = document.querySelector("#todo-description").value;
                let dueDate = document.querySelector("#todo-duedate").value;
                let priority = document.querySelector("#todo-priority").value;
                addNewTodo(project, title, des, dueDate, priority);
                dialog.close();
                generateDisplayForProject(project);
            })  
            dialog.showModal();
        });
        
        addButtonContainer.appendChild(addButtonSet);
        buttonArea.appendChild(addButtonContainer);
        displayArea.appendChild(buttonArea);
        display.appendChild(displayArea);
    }
    else if (project.getTodoCount() > 0) {
        const displayArea = createWithClass("div","display-area-with-tasks");
        displayArea.appendChild(createWithClass("div", "page-heading", project.getProjectName()));
        const todoList = getTodoList(project);
        todoList.forEach(todo => {
            displayArea.appendChild(generateTaskContainer("project", project,todo));
        })
        let taskAddContainer = createWithClass("div", "task-add-container");
        let img = createWithClass("img", "add-icon-bottom");
        img.src = AddBlack;
        img.alt = "Add";
        taskAddContainer.appendChild(img);
        taskAddContainer.appendChild(createWithClass("div", "add-text-bottom", "Add a task"));
        taskAddContainer.addEventListener("click", () => {
            generateAddEditTodoModal();
            const addButton = document.querySelector("dialog #add-button");
            addButton.addEventListener("click", (event) => {
                event.preventDefault();
                let title = document.querySelector("#todo-title").value;
                let des = document.querySelector("#todo-description").value;
                let dueDate = document.querySelector("#todo-duedate").value;
                let priority = document.querySelector("#todo-priority").value;
                addNewTodo(project, title, des, dueDate, priority);
                dialog.close();
                generateDisplayForProject(project);
            });
            dialog.showModal();
        });
        taskAddContainer.addEventListener("mouseover", () => {
            img.src = AddRed;
        });
        taskAddContainer.addEventListener("mouseout", () => {
            img.src = AddBlack;
        });
        displayArea.appendChild(taskAddContainer);
        display.appendChild(displayArea);
    }

}

function generateTaskContainer(type, project, todo, id = "today") {
    let container = document.createElement("div");
    let projectName = createWithClass("div", "project-name", project.getProjectName());
    if (type === "project") {
        container.classList.add("task-container-project");
    }
    else {
        container.classList.add("task-container-upcoming");
        container.appendChild(projectName);
    }
    let titleContainer = createWithClass("div", "title-container");
    titleContainer.appendChild(createWithClass("div", "title", todo.getTitle()));
    titleContainer.appendChild(createWithClass("div", "description", todo.getDescription()));
    container.appendChild(titleContainer);
    container.appendChild(createWithClass("div", "due-date", format(new Date(todo.getDueDate()), "do-MMM-yyyy")));
    container.appendChild(createWithClass("div", "days-left", `${getDaysRemaining(todo.getDueDate(),"text")}`));
    let priorityDiv = createWithClass("div", "priority", `${todo.getPriority()} Priority`);
    switch (todo.getPriority()) {
        case "High":
            priorityDiv.classList.add("high");
            break;
        case "Medium":
            priorityDiv.classList.add("medium");
            break;
        case "Low":
            priorityDiv.classList.add("low");
            break;
    }
    container.appendChild(priorityDiv);
    let checkBox = createWithClass("input", "check-box");
    checkBox.type = "checkbox";
    checkBox.checked = todo.getStatus();
    if (todo.getStatus() === true) {
            container.classList.add("strike-through");
    }
    else {
            container.classList.remove("strike-through");
    }

    checkBox.addEventListener("click", (event) => {
        setTodoStatus(event.target.checked, project, todo);
        if (type === "project")
            generateDisplayForProject(project);
        else if (type === "upcoming")
            document.getElementById(id).click();
    })
    container.appendChild(checkBox);
    if(type==="project"){
        let imgDiv = createWithClass("div", "delete");
        let img = document.createElement("img");
        img.src = EditGrey;
        img.addEventListener("mouseover", () => {
            img.src = EditRed;
        });
        img.addEventListener("mouseout", () => {
            img.src = EditGrey
        });
        img.addEventListener("click", () => {
            generateAddEditTodoModal("edit");
            document.querySelector("form h2").textContent = "Edit Todo Details";
            document.querySelector("#todo-title").value = todo.getTitle();
            document.querySelector("#todo-description").value = todo.getDescription();
            document.querySelector("#todo-duedate").value = todo.getDueDate();
            document.querySelector("#todo-priority").value = todo.getPriority();
            document.querySelector("#add-button").addEventListener("click", (event) => {
                event.preventDefault();
                editTodoDetails(document.querySelector("#todo-title").value, document.querySelector("#todo-description").value, document.querySelector("#todo-duedate").value, document.querySelector("#todo-priority").value, project, todo);
                document.querySelector("#dialog-modal").close();
            });
            document.querySelector("#dialog-modal").showModal();
        });
        img.alt = "Edit";
        imgDiv.appendChild(img);
        container.appendChild(imgDiv);
    }
    return container;
}

function generateAddEditTodoModal(type="add"){
    const dialog = document.querySelector("#dialog-modal");
    dialog.textContent="";
    dialog.className = "center";
    dialog.classList.add("add-todo-modal");

    let form = document.createElement("form");
    form.action = "#";
    form.id = "todo-entry-modal";
    let headerDiv = document.createElement("div");
    let h2 = document.createElement("h2");
    h2.textContent = "Enter Todo Details";
    headerDiv.appendChild(h2);
    form.appendChild(headerDiv);

    let titleSection = document.createElement("div");
    titleSection.classList.add("todo-title-section" , "form-section");
    let titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = "todo-title";
    titleInput.name = "todo-title";
    titleInput.placeholder = "Todo title";
    titleSection.appendChild(titleInput);
    form.appendChild(titleSection);

    let desSection = document.createElement("div");
    desSection.classList.add("todo-description-section" , "form-section");
    let desInput = document.createElement("input");
    desInput.type = "text";
    desInput.id = "todo-description";
    desInput.name = "todo-description";
    desInput.placeholder = "Todo description";
    desSection.appendChild(desInput);
    form.appendChild(desSection);

    let dateSection = document.createElement("div");
    dateSection.classList.add("todo-duedate-section" , "form-section");
    let dateLabel = document.createElement("label");
    dateLabel.for = "todo-duedate";
    dateLabel.textContent = "Due date: ";
    dateSection.appendChild(dateLabel);
    let dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.value = new Date().toDateInputValue();
    dateInput.min = new Date().toDateInputValue();
    dateInput.id = "todo-duedate";
    dateInput.name = "todo-duedate";
    dateSection.appendChild(dateInput);
    form.appendChild(dateSection);

    let prioritySection = document.createElement("div");
    prioritySection.classList.add("todo-priority-section" , "form-section");
    let priorityLabel = document.createElement("label");
    priorityLabel.for = "todo-priority";
    priorityLabel.textContent = "Priority:     ";
    prioritySection.appendChild(priorityLabel);
    let prioritySelect = document.createElement("select");
    prioritySelect.name = "todo-priority";
    prioritySelect.id = "todo-priority";
    let highPriority = document.createElement("option");
    highPriority.value = "High";
    highPriority.textContent = "High";
    prioritySelect.appendChild(highPriority);    
    let mediumPriority = document.createElement("option");
    mediumPriority.value = "Medium";
    mediumPriority.textContent = "Medium";
    prioritySelect.appendChild(mediumPriority);    
    let lowPriority = document.createElement("option");
    lowPriority.value = "Low";
    lowPriority.textContent = "Low";
    prioritySelect.appendChild(lowPriority);
    prioritySection.appendChild(prioritySelect);
    form.appendChild(prioritySection);

    if(type === "add")
        form.appendChild(generateFormButtonSection(2));    
    else
        form.appendChild(generateFormButtonSection(3));
    
    dialog.appendChild(form);    
}

function generateSideBarOptions(projectActive = "today"){
    //First remove all options before generating new
    const allProjectSideOptions = document.querySelectorAll(".side-options-project");
    allProjectSideOptions.forEach(projectSideOpttion => projectSideOpttion.remove());

    const addProjectDiv = document.querySelector(".add-project-button");
    const projects = getProject();
    let sideOptionCounter = 0;
    projects.forEach(project => {
        sideOptionCounter++;
        
        let buttonName = project.getProjectName();
        let mainDiv = createWithClass("div","side-options");
        mainDiv.classList.add("side-options-project");
        mainDiv.id = `id${sideOptionCounter}`;
        mainDiv.appendChild(createWithClass("div", "side-option-name", buttonName));
        let img = createWithClass("img","delete-side-option");
        img.src = EditBlack;
        img.alt = "Edit";
        img.addEventListener("mouseover", () => {
            img.src = EditRed;
        });
        img.addEventListener("mouseout", () => {
            img.src = EditBlack;
        });
        img.addEventListener("click", () => {
            generateAddProjectModal(3,project);
            const dialog = document.querySelector("#dialog-modal");
            document.querySelector("form input").value = project.getProjectName();
            const deleteButton = document.querySelector("#delete-button");
            deleteButton.addEventListener("click", (event) => {
                event.preventDefault();
                deleteProject(project);
                initializePage();/////////////////////////////////////Check later
                dialog.close();
            })
            dialog.showModal();
        });
        mainDiv.appendChild(img);
        const parentDiv = addProjectDiv.parentNode;
        mainDiv.addEventListener("click",()=>{
            generateDisplayForProject(project);
            setActiveMenu(mainDiv.id);
        });
        parentDiv.insertBefore(mainDiv, addProjectDiv);
        if (project === projectActive)
            mainDiv.click();
    })

}

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

function getDaysRemaining(dueDate, returnType = "number") {
    const today = startOfToday();
    let target = startOfDay(new Date(dueDate));
    console.log(target);
    console.log(today);
    if (isBefore(target, today)) {
        if (returnType === "text")
            return "Expired";
        else if (returnType === "number")
            return -1;
    }
    const diff = differenceInSeconds(target, today);
    const days = Math.floor(diff / 86400);
    if (returnType === "text")
        return `${days} days left`;
    else if (returnType === "number")
        return days;
}

function generateUpcomingEventListeners() {
    const projects = todoController.getProjectsArray();
    projects.forEach
    document.querySelector("#today").addEventListener("click", () => {
        setActiveMenu("today");
        generateDisplayForUpcoming("Today", 0,"today");
    });
    document.querySelector("#week").addEventListener("click", () => {
        setActiveMenu("week");
        generateDisplayForUpcoming("Next 7 Days", 7,"week");
    });
    document.querySelector("#all").addEventListener("click", () => {
        setActiveMenu("all");
        generateDisplayForUpcoming("All", -1,"all");
    });
}

function generateDisplayForUpcoming(header,daysCount,id){
    const displayArea = document.querySelector(".display-area");
    let displayAreaNoTask = createWithClass("div", "display-area-no-task");
    displayArea.textContent = "";
    let noItemsToDisplay = true;

    let displayAreaWithTasks = createWithClass("div", "display-area-with-tasks");
    displayAreaWithTasks.appendChild(createWithClass("div", "page-heading", header));
    displayAreaNoTask.appendChild(createWithClass("div", "page-heading", header));
    const projects = todoController.getProjectsArray();
    projects.forEach(project => {
        let todoArray = getTodoList(project);
        todoArray.forEach(todo => {
            noItemsToDisplay = false;
            let target = todo.getDueDate();
            let todoDaysLeft = getDaysRemaining(target, "number");
            if (todoDaysLeft <= daysCount && todoDaysLeft >= 0 && daysCount !== -1) {
                displayAreaWithTasks.appendChild(generateTaskContainer("upcoming", project, todo,id));
            }
            else if (daysCount === -1) {
                displayAreaWithTasks.appendChild(generateTaskContainer("upcoming", project, todo,id));
            }
             
        });
    });
    if(noItemsToDisplay === false)
        displayArea.appendChild(displayAreaWithTasks);
    else {
        displayAreaNoTask.appendChild(createWithClass("div", "no-task-display", "No tasks to show here! "));
        displayArea.appendChild(displayAreaNoTask);
    }

}




export {setActiveMenu , initializePage};