let myLeads = [];

const inputBtn = document.getElementById("input-btn");
const inputEl = document.getElementById("input-el");
const ulEl = document.getElementById("ul-el");
const tabBtn = document.getElementById("tab-btn");
const deleteBtn = document.getElementById("delete-btn");

let leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));
//this is an array with the leads

if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage;
    render(myLeads);
}

function addToList() {
    if (inputEl.value) {
        myLeads.push(inputEl.value);
        inputEl.value = "";
        localStorage.setItem("myLeads", JSON.stringify(myLeads));
    }
}

inputBtn.addEventListener("click", function () {
    addToList();
    render(myLeads);
})

tabBtn.addEventListener("click", function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        myLeads.push(tabs[0].url);
        localStorage.setItem("myLeads", JSON.stringify(myLeads));
        render(myLeads);
    })
})

deleteBtn.addEventListener("dblclick", function () {
    localStorage.clear();
    myLeads = [];
    render(myLeads);
})

inputEl.addEventListener("keyup", (event) => {
    if (event.which === 13) { //this detects enter key
        addToList();
        render(myLeads);
    }
})

function removeLead(i) {
    myLeads = JSON.parse(localStorage.getItem("myLeads"));
    localStorage.clear();
    myLeads.splice(i, 1);
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    render(myLeads);
}

function render(array) {
    let listItems = "";
    for (let i = 0; i < array.length; i++) {
        //ulEl.innerHTML += "<li>" + myLeads[i] + "</li>";
        // OR
        // const li = document.createElement("li");
        // li.textContent = myLeads[i];
        // ulEl.append(li);

        //listItems += "<li><a target = '_blank' href = '" + myLeads[i] + "'>" + myLeads[i] + "</a></li>"
        //OR
        listItems += `
                  <li>
                       <a target = _blank href=${array[i]}>
                            ${array[i]}
                       </a>                            
                       <button id="removeButton${i}" class = "remove-btn"><img src = "/img/trash.png"></button>            
                  </li>
        ` // this is called template String and is easier to read and can break it into multiple lines

    }

    ulEl.innerHTML = listItems; //faster if we use dom manipulation once, instead of 3 times

    for (let i = 0; i < array.length; i++) {
        let btn = document.getElementById(`removeButton${i}`);
        btn.removeEventListener('click', () => removeLead(i));
        btn.addEventListener('click', () => removeLead(i));
    }

}
