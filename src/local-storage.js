export function storageAvailable(type) {
    let storage;
    try {
      storage = window[type];
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        // everything except Firefox
        (e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === "QuotaExceededError" ||
          // Firefox
          e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
}

export function addNewProjectToStorage(projectObj){
    localStorage.setItem(`${projectObj.getProjectName()}-proj`,JSON.stringify(projectObj));
}

export function setTaskletFlag(){
    localStorage.setItem("Tasklet","Initialized");
}

export function getTaskletFlag(){
    return localStorage.getItem("Tasklet")
}

export function writeToStorage(projects){
    localStorage.clear();
    setTaskletFlag();
    localStorage.setItem("projects",JSON.stringify(projects));
}

export function readLocalStorage(){
    // const items = { ...localStorage };
    // const tempArray = Object.values(items);
    // const finalObjectArray=[]
    // tempArray.forEach(obj=>{
    //     if(obj!== "Initialized")
    //         finalObjectArray.push(JSON.parse(obj));
    // });
    // return finalObjectArray;
  return JSON.parse(localStorage.getItem("projects"));

}