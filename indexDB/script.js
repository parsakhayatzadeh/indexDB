let db;
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const ageInput = document.getElementById("age");
const form = document.querySelector("form");
const list = document.querySelector("ul")

window.onload = () => {
    let request = window.indexedDB.open("contacts", 1);

    request.onerror = () => {
        console.log("failed to conect contacts");
    }

    request.onsuccess = () => {
        console.log("open contacts");
        db = request.result;
        getData()
    }

    request.onupgradeneeded = (e) => {
        let db = e.target.result;
        console.log(db);

        let objectStore = db.createObjectStore("contacts", {
            keyPath: "id",
            autoIncrement: true
        });

        objectStore.createIndex("firstName", "firstName", {
            unique: false
        })

        objectStore.createIndex("lastName", "lastName", {
            unique: false
        })

        objectStore.createIndex("age", "age", {
            unique: false
        })


    }

}

function addData(e) {
    e.preventDefault();

    let newItem = {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        age: ageInput.value,
    }

    let transaction = db.transaction(["contacts"], "readwrite").objectStore("contacts").add(newItem)
    console.log(transaction);

    transaction.onsuccess = () => {
        firstNameInput.value = "";
        lastNameInput.value = "";
        ageInput.value = "";
    }
    transaction.oncomplete = () => {
        console.log("add data to database is completed");
        getData()
    }
    transaction.onerror = () => {
        console.log("failed to add item to contacts");
    }
    getData()


}
form.addEventListener("submit", addData)

function getData() {
    while (list.firstChild) {

        list.removeChild(list.firstChild)

    }

    let objectStore = db.transaction("contacts").objectStore("contacts");

    objectStore.openCursor().onsuccess = (e) => {
        let cursor = e.target.result;

        if (cursor) {

            let listItem = document.createElement("li");
            let first = document.createElement("p");
            let last = document.createElement("p");
            let Age = document.createElement("p");
            let deleteBtn = document.createElement("button");


            listItem.setAttribute("class", " border-bottom pt-3");

            listItem.appendChild(first);
            listItem.appendChild(last);
            listItem.appendChild(Age);
            listItem.appendChild(deleteBtn)
            list.appendChild(listItem);

            first.textContent = `FirstName : ${cursor.value.firstName}`;
            last.textContent = `LastName : ${cursor.value.lastName}`;
            Age.textContent = `age : ${cursor.value.age}`;
            deleteBtn.textContent = 'delete';

            deleteBtn.addEventListener("click" ,deleteItem)

            listItem.setAttribute("data-contact-id" , cursor.value.id)

            


            cursor.continue();



        }else{
            if (!list.firstChild) {
                let listItem = document.createElement("li");
                listItem.textContent = "There is No Contact..."
                list.appendChild(listItem)
                
            }
        }
    }

}

function deleteItem(e) {

    let contactId = Number(e.target.parentElement.getAttribute("data-contact-id")) ;
    console.log(contactId);

    let transaction = db.transaction(["contacts"], "readwrite")
    let request = transaction.objectStore("contacts").delete(contactId);
    console.log("item deleted from indexDB");


    transaction.oncomplete=() =>{ 
        e.target.parentElement.parentElement.removeChild(e.target.parentElement);
        if (!list.firstChild) {
            let listItem = document.createElement("li");
            listItem.textContent = "There is No Contact..."
            list.appendChild(listItem)
            
        }
    }

    
    
}