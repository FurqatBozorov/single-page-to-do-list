let tester=0;
let loginTest = 0;
let finalTodoForStorage=[];
let activeListName;



function goToSignUpForm() {
    document.getElementsByClassName('welcome-page')[0].style.display = 'none'
    document.getElementsByClassName('sign-up-form')[0].style.display = 'block'

    document.getElementsByClassName('signUpName')[0].value =''
    document.getElementsByClassName('signUpLasname')[0].value =''
    document.getElementsByClassName('signUpEmail')[0].value =''
    document.getElementsByClassName('signUpPassword')[0].value =''

}
function goToLogInForm() {
    document.getElementsByClassName('welcome-page')[0].style.display = 'none'
    document.getElementsByClassName('log-in-form')[0].style.display = 'block'
}

function signUp(event){
    let users=[];
    event.preventDefault();
    let name=event.target.name.value;
    let lastName=event.target.lastname.value;
    let email = event.target.email.value;
    let password = event.target.password.value;
    let hashedPass = md5(password);
    
    let raw = localStorage.getItem('users')
    users = JSON.parse(raw)

    let newUser={
        userName : name,
        userLastName : lastName,
        userEmail : email,
        userPassword : hashedPass
    }
    
    if(users==null) {
        let users=[];
         users.push(newUser)
         addUser(users)
         document.getElementsByClassName('sign-up-form')[0].style.display = 'none'
         document.getElementsByClassName('dashboard')[0].style.display = 'block'
         setActiveuser(email);
         displayList()
     }else if(users.length>0){
        for(prop of users){
           if(prop.userEmail== email){
               document.getElementById('sign-up-mistake').innerText='Somebody already uses this e-mail!!!'
            tester++;
            break;
            }
        }
        if(tester===0){
            users.push(newUser)
            addUser(users)
            setActiveuser(email)
            document.getElementsByClassName('sign-up-form')[0].style.display = 'none'
            document.getElementsByClassName('dashboard')[0].style.display = 'block'
        }else{
            tester=0
        }
    }
  
    };
    
    
function addUser(data) {
    localStorage.setItem('users',JSON.stringify(data))    
}
function setActiveuser(data) {
    localStorage.setItem('activeUser', data)    
}

function login(event) {
    event.preventDefault();
    let email = event.target.email.value;
    let password = event.target.password.value;
    let hashedPass = md5(password);

    let raw = localStorage.getItem('users');
    let registeredUsers = JSON.parse(raw);
    
    for(prop of registeredUsers){
        if (prop.userEmail==email && prop.userPassword==hashedPass){
            document.getElementsByClassName('log-in-form')[0].style.display = 'none'
            document.getElementsByClassName('dashboard')[0].style.display = 'block'
           loginTest++
           setActiveuser(email) 
           displayList()
           break;
        }
    }
    if (loginTest == 0) {
        document.getElementById('log-in-mistake').innerText='Incorrect email or password'
    }

    }

    function createToDo() {
        let activeUser=localStorage.getItem('activeUser')
        if(activeUser!==''){
            document.getElementsByClassName('log-in-form')[0].style.display = 'none'
        document.getElementsByClassName('dashboard')[0].style.display = 'none'
        document.getElementsByClassName('sign-up-form')[0].style.display = 'none'
        document.getElementsByClassName('welcome-page')[0].style.display = 'none'
        document.getElementsByClassName('task-board')[0].style.display = 'none'
        document.getElementsByClassName('to-do-list-form')[0].style.display = 'block'        
            }
        }

    function createNewList(e) {
        let toStore = [];
        e.preventDefault()
         let newListName = e.target.toDoListName.value
         if(newListName!==''){
            let activeUser  =localStorage.getItem('activeUser')
            let raw = localStorage.getItem('todolist')
            let parsedRaw = JSON.parse(raw)
            if(parsedRaw!== null){
                toStore= parsedRaw
            }
            
            let listArray = [];
           listArray[0]=activeUser;
           listArray[1]=newListName;
           listArray[2]=[];
   
           toStore.push(listArray)
           localStorage.setItem('todolist', JSON.stringify(toStore))
           document.getElementsByClassName('to-do-list-form')[0].style.display = 'none'
           document.getElementsByClassName('dashboard')[0].style.display = 'block'
           displayList()
           e.target.toDoListName.value = ''
         }else{
            document.getElementById('hello').innerText='Please do not add empty string!'
            document.getElementById('hello').style.color = 'red'
            console.log('empty string');       
        }
         
            }

    function displayList() {
       let raw = localStorage.getItem('todolist')
       let todolist = JSON.parse(raw)
       let activeUser = localStorage.getItem('activeUser')
       listingToDoListNames(todolist, activeUser)

    }
    
    
    function listingToDoListNames(items, activeUser) {
        let listNames=[]
        
        for(let item of items){
           if(item[0] === activeUser){
               listNames.push(item[1])
           }
        } 
        document.getElementById('listnames').innerHTML = '';
        for(let prop of listNames){
            createdDiv = document.createElement('div')
            createdDiv.onclick = goToListTasks
            createdDiv.innerText = prop
            createdDiv.classList.add('list-name')
            document.getElementById('listnames').appendChild(createdDiv)
        }
    }

    function goToListTasks(data) {
        data.preventDefault()
        document.getElementsByClassName('task-board')[0].style.display = 'block'
        document.getElementsByClassName('dashboard')[0].style.display = 'none'
        activeListName = data.target.innerText;    
       document.getElementById('list-name').innerText = activeListName; 
       let raw = localStorage.getItem('todolist')
       let todolist = JSON.parse(raw)
       let activeUser = localStorage.getItem('activeUser')
      taskListing(activeUser, activeListName, todolist)
    } 

    function taskListing(activeUser, listName, todolist) {
        document.getElementById('task-name-board').innerHTML=''
        for(let prop of todolist){
            if(prop[0]==activeUser && prop[1]==listName){
                for(let item of prop[2]){
                createdTaskForm = document.createElement('form')
                createdTaskForm.onsubmit = deleteTask
                createdTaskPi= document.createElement('p')
                createdCheckBox = document.createElement('input')
                createdCheckBox.type='checkbox'
                createdTaskPi.innerHTML = item
                createdTaskDelete=document.createElement('button')
                createdTaskDelete.type='submit'
                createdTaskDelete.innerHTML='x'
                createdTaskForm.appendChild(createdCheckBox)
                createdTaskForm.appendChild(createdTaskPi)
                createdTaskForm.appendChild(createdTaskDelete)
                createdTaskForm.classList.add('created-task-div')
               
                
                document.getElementById('task-name-board').appendChild(createdTaskForm)
            }}
        }
    } 
    function addNewTask(e){
        e.preventDefault();
        let newTask = e.target.taskName.value
        let activeUser = localStorage.getItem('activeUser')
        let raw = localStorage.getItem('todolist')
        let todolist = JSON.parse(raw)
        let taskList =[]; 
       if(newTask!==''){
        document.getElementById('new-task-adding-mistake').innerText=''
        for(let item of todolist){
            if(item[0] == activeUser && item[1] == activeListName){
                taskList = item[2];
                taskList.push(newTask);
                item[2] = taskList;
                }
        }}else{
            document.getElementById('new-task-adding-mistake').innerText = 'Please, enter the task name before you submit!!!'
        }
        
        localStorage.setItem('todolist',JSON.stringify(todolist));
        e.target.taskName.value = ''
        taskListing(activeUser,activeListName,todolist)
    }  

    function deleteTask(e) {
        e.preventDefault();
        let raw =e.target.innerText
        let task = raw.slice(0, raw.length-3)
        let activeUser = localStorage.getItem('activeUser')
        let rawtodolist = localStorage.getItem('todolist')
        let todolist = JSON.parse(rawtodolist)

        for(let prop of todolist){
            if(prop[0]==activeUser && prop[1]== activeListName){
                let id= prop[2].indexOf(task)
                prop[2].splice(id, 1)
                console.log(prop[2]);
            }
        }
        localStorage.setItem('todolist',JSON.stringify(todolist));
         rawtodolist = localStorage.getItem('todolist')
         todolist = JSON.parse(rawtodolist)

        
        taskListing(activeUser,activeListName,todolist)

    }


    function changeTaskName() {
        document.getElementsByClassName('to-do-list-form')[0].style.display='block'
        document.getElementsByClassName('task-board')[0].style.display='none'              
    }

    function signOut() {
         localStorage.setItem('activeUser','')
         document.getElementsByClassName('log-in-form')[0].style.display = 'none'
         document.getElementsByClassName('dashboard')[0].style.display = 'none'
         document.getElementsByClassName('sign-up-form')[0].style.display = 'none'
         document.getElementsByClassName('welcome-page')[0].style.display = 'block'
         document.getElementsByClassName('task-board')[0].style.display = 'none'
         document.getElementsByClassName('to-do-list-form')[0].style.display = 'none'
         
         document.getElementsByClassName('signUpName')[0].value =''
         document.getElementsByClassName('signUpLasname')[0].value =''
         document.getElementsByClassName('signUpEmail')[0].value =''
         document.getElementsByClassName('signUpPassword')[0].value =''

                         }

     function settingButton() {
        let activeUser=localStorage.getItem('activeUser')
        if(activeUser!==''){
        let raw = localStorage.getItem('users') 
        let users = JSON.parse(raw)
        document.getElementsByClassName('log-in-form')[0].style.display = 'none'
        document.getElementsByClassName('dashboard')[0].style.display = 'none'
        document.getElementsByClassName('sign-up-form')[0].style.display = 'block'
        document.getElementsByClassName('welcome-page')[0].style.display = 'none'
        document.getElementsByClassName('task-board')[0].style.display = 'none'
        document.getElementsByClassName('to-do-list-form')[0].style.display = 'none'
        

            for(let user of users){
                if(user.userEmail == activeUser){
                    document.getElementsByClassName('signUpName')[0].defaultValue =user.userName
                    document.getElementsByClassName('signUpLasname')[0].defaultValue =user.userLastName
                    document.getElementsByClassName('signUpEmail')[0].defaultValue =user.userEmail
                    document.getElementsByClassName('signUpPassword')[0].defaultValue =user.userPasword
                }
            }
       }
                        
     }