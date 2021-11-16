const ulTagofPagination = document.querySelector(".paginationContainer ul");
const paginationLimit = 10;
var noOfPages; 
var filteredUsers = [];
var userDataFromAPI, userData;
let linkToAPI = "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
let jsonDataRequest = new XMLHttpRequest();
jsonDataRequest.open('GET', linkToAPI);
jsonDataRequest.responseType = 'json';
jsonDataRequest.send();

jsonDataRequest.onload = function() {
    userDataFromAPI = jsonDataRequest.response;
    userDataFromAPI.forEach((item) => {
        item["selected"] = false;
    });
    userData = userDataFromAPI;
    console.log(userData);
    setPagination(userData);    
    setPages(noOfPages,1); //calling the function element with passing values, total no. of pages and the current page number
    displayUserList(noOfPages,1);
}

function setPagination() {
    var filterFlag = arguments[2]? arguments[2] : "";
    data = filterFlag ? filteredUsers : arguments[0];
    // noOfPages = data.length / paginationLimit; 
    noOfPages = data.length % 10 == 0 ? data.length / 10 : Math.floor(data.length / paginationLimit) + 1;
}

function setPages(totalPages, currentPage){
    let liTagofPagination = '';
    let activeLi; //this variable keeps track if the current page's page number is active
    let beforePages =  currentPage-1;
    let afterPages =  currentPage+1;
    if( currentPage>1){  //if current page no. is greater than 1 , then add li that show the previous button
        liTagofPagination+=`<li class="previousIcon angleButton" onclick="displayUserList(noOfPages,${ currentPage-1})"><span><i class="fa fa-solid fa-angle-left"></i></span></li>`
    }

    for(let pageNumber = beforePages; pageNumber<=afterPages; pageNumber++ ){
        if(pageNumber!=0 && pageNumber!=totalPages+1){
            if( currentPage==pageNumber){
                activeLi="active";
            }
            else{
                activeLi="";
            }
            liTagofPagination+=`<li class="pageNumber ${activeLi} " onclick="displayUserList(noOfPages,${pageNumber})"><span>${pageNumber}</span></li>`;
        }
    }

    if( currentPage<totalPages){  //if current page no. is less than totalPages then add li that show the next button
        liTagofPagination+=`<li class="nextIcon angleButton" onclick="displayUserList(noOfPages,${ currentPage+1})"><span><i class="fa fa-solid fa-angle-right"></i></span></li>`;
    }

    ulTagofPagination.innerHTML = liTagofPagination;
}

function displayUserList(){
    var pageLength = arguments[0];
    var pageNumber = arguments[1];
    var filterFlag = arguments[2]? arguments[2] : "";
    setPages(pageLength,pageNumber);
    console.log(pageNumber,pageLength)
    var startIndex = (pageNumber-1)*10;
    var endIndex = pageNumber*10 ;
    var userListOnPage = filterFlag ? filteredUsers.slice(startIndex,endIndex) : userData.slice(startIndex,endIndex);
    console.log(userListOnPage);
     
    var allUsersElement = document.getElementById("allUsersContainer");
    allUsersElement.innerHTML = "";

    userListOnPage.forEach((item)=>{
        //list container
        var singleUserElement = document.createElement('div');
        singleUserElement.classList.add("individualListContainer");
        singleUserElement.id = "highlightCheckBox" + item["id"];

        //checkbox
        const checkboxElement = document.createElement('div');
        // checkboxElement.classList.add("individualBoxStyling");

        var userCheckBox = document.createElement('input');
        userCheckBox.type = 'checkbox';
        userCheckBox.name = 'userListItem';
        userCheckBox.id = item["id"];
        userCheckBox.value = item["id"];
        userCheckBox.checked = item.selected;

        checkboxElement.appendChild(userCheckBox);

        //name field

        const nameElement = document.createElement('div');
        nameElement.classList.add("individualBoxStyling");

        var userName = document.createElement('input');
        userName.type = 'text';
        userName.name = 'userListItem';
        userName.id = "name" + item["id"];
        userName.value = item["name"];

        nameElement.appendChild(userName);
			
        //email field

        const emailElement = document.createElement('div');
        emailElement.classList.add("individualBoxStyling");

        var userEmail = document.createElement('input');
        userEmail.type = 'text';
        userEmail.name = 'userListItemEmail';
        userEmail.id = "email" + item["id"];
        userEmail.value = item["email"];

        emailElement.appendChild(userEmail);
			
        //role field

        const roleElement = document.createElement('div');
        roleElement.classList.add("individualBoxStyling");

        var userRole = document.createElement('input');
        userRole.type = 'text';
        userRole.name = 'userListItemEmail';
        userRole.id = "role" + item["id"];
        userRole.value = item["role"];

        roleElement.appendChild(userRole);
		
        //action user

        const actionElement = document.createElement('div');
        actionElement.classList.add("individualBoxStyling");
        actionElement.id="actionEntry";

        //edit user
        const editElement = document.createElement('div');
        const editIcon = document.createElement('i');
        editIcon.classList.add("fa"); 
        editIcon.classList.add("fas");
        editIcon.classList.add("fa-user-edit");

        editElement.appendChild(editIcon);

        //delete user
        const deleteElement = document.createElement('div');
        deleteElement.id="deleteButton" + item["id"]
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add("fa");
        deleteIcon.classList.add("fas");
        deleteIcon.classList.add("fa-trash");

        deleteElement.appendChild(deleteIcon);

        //append to actionElement
        actionElement.appendChild(editElement);
        actionElement.appendChild(deleteElement);

        //append to singleContainer
        singleUserElement.appendChild(checkboxElement);
        singleUserElement.appendChild(nameElement);
        singleUserElement.appendChild(emailElement);
        singleUserElement.appendChild(roleElement);
        singleUserElement.appendChild(actionElement);

		//append to allUserContainer
        allUsersElement.appendChild(singleUserElement);

        //adding event listeners
		  document.addEventListener('click',function(e){
			if(e.target && e.target.id == "deleteButton" + item["id"]){
				  deleteSingleUser(item["id"]);
			 }
		 });

         document.addEventListener('change',function(e){
			if(e.target && e.target.id == item["id"]){
				  toggleSelectedUser(item["id"], e.target.checked);
			 }
		 });
    });
}

function deleteSingleUser(userid){
    console.log('delete',userid);
    elementIndex = userData.findIndex((item) => { 
        return item.id == userid;
    });
    console.log(elementIndex);
    if(elementIndex > -1) {
        userData.splice(elementIndex, 1);
        setPagination(userData);
        var tempElementIndex = elementIndex;
        if(elementIndex == userData.length) { //last array element 
            tempElementIndex = elementIndex % 10 == 0 ? elementIndex - 1 : elementIndex;
            currentIndex = tempElementIndex % 10 == 0 ? tempElementIndex / 10 : Math.floor(tempElementIndex / 10) + 1;
        } else if(elementIndex == userData.length - userData.length%10) {
            currentIndex = elementIndex / 10 + 1;
        } else {
            currentIndex = tempElementIndex % 10 == 0 ? tempElementIndex / 10 : Math.floor(tempElementIndex / 10) + 1;
        }
        displayUserList(noOfPages, currentIndex);
    }
}

function toggleSelectedUser(userid, cbValue){
    console.log('toggle',userid)
    userData.forEach((item) => {
        if(item.id == userid){
            item["selected"] = cbValue;
        }
    });
    var singleUserElement = document.getElementById("highlightCheckBox" + userid);
    if(cbValue == true)
    {
        singleUserElement.classList.add("highlightIndividualListContainer");
    } else {
        singleUserElement.classList.remove("highlightIndividualListContainer");
    }
}

function deleteSelectedUsers() {
    var selectedUsers = userData.filter((item)=>{
        return item.selected;
    })
    selectedUsers.forEach((item, index) => {
        elementIndex = userData.findIndex((ele) => { 
            return item.id == ele.id;
        });
        console.log(elementIndex);
        userData.splice(elementIndex, 1);
    });
    setPagination(userData);
    displayUserList(noOfPages, 1);
}

function filterUserList(){
    var searchQuery = document.getElementById('filterUsers').value;
    var filterBasedOn = document.getElementById('filterOn').value;
    if(searchQuery) {
        switch(filterBasedOn) {
          case 'name':
            filteredUsers = userData.filter((item) => { return item.name.includes(searchQuery)});
            break;
          case 'email':
            filteredUsers = userData.filter((item) => { return item.email.includes(searchQuery)});
            break;
            case 'role':
                filteredUsers = userData.filter((item) => { return item.role.includes(searchQuery)});
        }
        console.log(filteredUsers);
        setPagination(filteredUsers, 'filter');
        displayUserList(noOfPages, 1, 'filter');
    } else {
        setPagination(userData);
        displayUserList(noOfPages, 1);
    }
}
