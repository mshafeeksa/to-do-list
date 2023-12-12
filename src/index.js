// import Logo from "./restaurant-logo.png";
// import generateMenu from "./menu";
import './style.css';
import * as rte from './rte';
import { initializePage } from './display';

const mainController = (function(){
    if(rte.checkLocalStorageAvailability() === true){
        if (rte.checkFirstTimeUser() === true){
            rte.initializeTasklet();
        }
        else{
            rte.readLocalStorage();
        }
    }
    else{
        alert("Local storage not available. Application will not work .Please check your settings!");
    }
})();