

async function loadData(dataPath){
    var re = await fetch(dataPath, {cache: "no-cache"}).then(function(res){
        return res.text();
    }).then(function(response){
        //return JSON.parse(response);
        return response;
    })

    //console.log(re)
    return re;
}

//importScripts("../js/loadData.js");

async function loadElement(selector, target){

    var statusCode = 0
    await fetch(target, {cache: "no-cache"}).then(function(res){
        statusCode = res.status;
        return res.text();
    }).then((response)=>{
        document.querySelector(selector).innerHTML = response;
        return response.status;
    })

    //console.log(statusCode)

    return statusCode
}

document.querySelectorAll("#navBar .fa").forEach((item) => {
    
    item.onclick = ()=>{
            
        document.querySelectorAll("#navBar .fa.active").forEach((ele)=>{
            ele.classList.remove("active");
        })

        item.classList.add("active");
    }
});


function createProjectBox(data){
    //console.log(data)

    let tempClass = 0;

    let cardTitleWrapper = document.createElement("div");
    cardTitleWrapper.className = "cardTitleWrapper"

    let card = document.createElement("div");
    card.className = "col-md-6 col-12 card";
    card.dataset.displayable = "1";
    card.dataset.projectclasses = ""

    for(let i = projectClassesStartNum ; i < data.length ; i++){
        if(data[i] == "1")
            card.dataset.projectclasses += i-projectClassesStartNum+1 + ",";
    }

    let image = document.createElement("span");
    image.className = "image";

    if(data[1] != "")
        image.style = "--img:url('../" + data[1] + "');";
    else
        image.style = "--img:url('../img/noImg.png');";
    
    let cardTitle = document.createElement("div");
    cardTitle.className = "cardTitle";
    cardTitle.innerHTML = data[0]

    let div = document.createElement("div");

    if(data[2] != ""){
        card.dataset.bsToggle = "modal";
        card.dataset.bsTarget = "#projectModal";

        card.classList.add("more")

        
        card.onclick = ()=>{
            loadElement("#projectModal .modal-body", data[2]);
        }
        //let temp = data[0];
        //document.querySelector("#projectModal .modal-title").innerHTML = temp;
    }

    if(data[3] != ""){
        let button = document.createElement("a");
        button.className = "button";
        button.innerHTML = "GitHub";
        button.href = data[3];
        button.target = "_blank";
        /*button.onclick = ()=>{
            window.open(data[3]);
        }*/
        div.append(button);
    }

    if(data[4] != ""){
        let button2 = document.createElement("a");
        button2.className = "button2";
        button2.innerHTML = "Visit Site"
        button2.href = data[4]
        button2.target = "_blank";

        /*button2.onclick = ()=>{
            window.open(data[4]);
        }*/
        div.append(button2);
    }

    let timeAndBoss = document.createElement("div");

    if(data[6] != ""){
        //console.log(data[6])
        let time = document.createElement("span");
        time.className = "fa fa-clock-o fs-6 text-light info";
        time.innerHTML = " " + data[6]
        timeAndBoss.append(time);
    }

    if(data[7] != ""){
        //console.log(data[7])
        let boss = document.createElement("span");
        boss.className = "fa fa-user-circle fs-6 text-light info";
        boss.innerHTML = " " + data[7]
        timeAndBoss.append(boss);
    }

    card.append(image);
    // card.append(cardTitle);
    cardTitleWrapper.append(cardTitle);

    if(data[5] != ""){
        //console.log(data[5])
        let tech = document.createElement("span");
        tech.className = "fs-6 text-light info";
        tech.innerHTML = data[5]
        cardTitleWrapper.append(tech);
    }
    cardTitleWrapper.append(timeAndBoss);
    cardTitleWrapper.append(div);
    card.append(cardTitleWrapper);
    // card.append(timeAndBoss)
    // card.append(div);

    document.querySelector("#projectContainer").append(card);
    
}

var projectClassesStartNum = 8;
var projectClasses = ["All"];
var projectClassesLen = 0;

async function loadProjectData(){
    let data = await loadData("data/data.csv");
    data = data.split("\n");

    let title = data[0].replace("\r", "").split(",");
    for(let i = projectClassesStartNum ; i < title.length ; i++){
        projectClasses.push(title[i])
    }
    projectClassesLen = projectClasses.length;

    for(let i = 0 ; i < projectClassesLen ; i++){
        let button = document.createElement("span");
        button.className = "button";
        if(i == 0)
            button.classList.add("active")
        button.innerHTML = projectClasses[i];
        button.dataset.projectclasses = i;
        button.onclick = ()=>{
            projectClassSelector(button);
            document.querySelectorAll("#projectClass .button").forEach((item)=>{
                item.classList.remove("active")
            })
            button.classList.add("active")
        }
        document.querySelector("#projectClass").append(button)
    }

    for(let i = 1 ; i < data.length-1 ; i++){
        createProjectBox(data[i].replace("\r", "").split(","))
    }

    createPageButton()
    //console.log(data);
}

function projectClassSelector(obj){
    let selected = obj.dataset.projectclasses;

    if(selected == "0"){
        document.querySelectorAll("#projectContainer .card").forEach((item)=>{
            item.hidden = false;
            item.dataset.displayable = "1";
        })
    }else{
        document.querySelectorAll("#projectContainer .card").forEach((item)=>{
            item.hidden = true;
            item.dataset.displayable = "0";
        })

        // '#projectContainer .card[data-projectclasses="' + selected + '"]'

        document.querySelectorAll('#projectContainer .card').forEach((item)=>{
            if(item.dataset.projectclasses.split(",").includes(selected)){
                item.hidden = false;
                item.dataset.displayable = "1";
            }
        })
    }

    createPageButton();
}

function createPageButton(){
    if(document.querySelector("#pageButton .button")){
        document.querySelectorAll("#pageButton .button").forEach((item)=>{
            item.remove();
        })
    }

    document.querySelectorAll('#projectContainer .card[data-displayable="1"]').forEach((item, i)=>{
        if(i % numPerPage == 0){
            let pageButton = document.createElement("span");
            pageButton.className = "button";
            pageButton.onclick = ()=>{
                projectPages(i/numPerPage + 1);

                document.querySelectorAll("#pageButton .button").forEach((item)=>{
                    item.classList.remove("active");
                })
                pageButton.classList.add("active");
            }
            pageButton.innerHTML = i/numPerPage + 1;

            document.querySelector("#pageButton").append(pageButton);
        }
    })
    if(document.querySelector('#projectContainer .card[data-displayable="1"]'))
        document.querySelector("#pageButton .button").click();
}

var numPerPage = 6;
function projectPages(page){
    let selected = document.querySelector("#projectClass .button.active").dataset.projectclasses;
    
    //let querySelector = '#projectContainer .card[data-displayable="1"]';

    document.querySelectorAll('#projectContainer .card[data-displayable="1"]').forEach((item, i)=>{
        if(i >= (page-1)*6 && i < page*6){
            item.hidden = false;
        }else{
            item.hidden = true;
        }
    })
}

function sendMessage(){
    let name = document.querySelector("#SendMessageForm #inputFullName").value;
    let email = document.querySelector("#SendMessageForm #inputEmail").value;
    let message = document.querySelector("#SendMessageForm #inputMessage").value;

    if(name == "" || email == "" || message == "")
        return

    let data = new FormData();
    data.append("entry.967096916", name);
    data.append("entry.531862067", email);
    data.append("entry.447610124", message);

    let body = {
        "entry.967096916": name,
        "entry.531862067": email,
        "entry.447610124": message
    }

    let url = "https://docs.google.com/forms/u/5/d/e/1FAIpQLSfaRoFJRUDdglUQDjY4517MrOl5MtdN7jYJ1WSZRCjBcN2glQ/formResponse";
    fetch(url, {
        method: "post",
        mode: "no-cors",
        body: data
    }).then((res)=>{
        return res.status;
    }).then((response)=>{
        //console.log(response);
    })

    document.querySelector("#SendMessageForm #inputFullName").value = "";
    document.querySelector("#SendMessageForm #inputEmail").value = "";
    document.querySelector("#SendMessageForm #inputMessage").value = "";
}

//拖動
function dragElement(elmnt) {
    //console.log(elmnt)
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "Header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    
    
    if((elmnt.offsetTop - pos2) < 0 || (elmnt.offsetTop - pos2) > window.innerHeight - elmnt.offsetHeight)
        return

    if((elmnt.offsetLeft - pos1) < 0 || (elmnt.offsetLeft - pos1) > window.innerWidth - elmnt.offsetWidth)
        return
    

    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
