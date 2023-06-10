let AktualLists = {};

let fieldNameList = ["ZielKundenID", "KundenPRIO", "WerKummertSich", "Firmenname", "NameDesKontakts", "RechnungsAdresse", "Ort", "Postleitzahl", "Land_Region", "Telefonnummer", "EMailAdresse", "Anmerkungen"];

function download(dataurl, filename) {
    const link = document.createElement("a");
    link.href = dataurl;
    link.download = filename;
    link.click();
}

function createFilterOptions() {
    let i = 0;
    for (let fieldName of fieldNameList) {
        let htmlElem = document.getElementById(fieldName);
        let betoltendoLista = ["Any"];
        window['ac_' + i] = new Autocomplete(htmlElem, betoltendoLista);
        i++;
    }
}

function setFilterOptions(Lists) {
    let i = 0;
    for (let fieldName of fieldNameList) {
        let htmlElem = document.getElementById(fieldName);
        let betoltendoLista = Lists[createListNameFromFieldName(fieldName)];
        AktualLists[createListNameFromFieldName(fieldName)] = betoltendoLista;
        // console.log(betoltendoLista);
        window['ac_' + i] = new Autocomplete(htmlElem, betoltendoLista);
        i++;
    }
}

function createListNameFromFieldName(FieldName) {
    return FieldName + "List";
}

function deleteFilterOptions() {
    let i = 0;
    for (let fieldName of fieldNameList) {
        window['ac_' + i].clean();
        delete window['ac_' + i];
        i++;
    }
}

function reset(caller) {
    let divElement = caller.parentElement;
    ActiveFilterElement = divElement.querySelector("input.Filter");
    ActiveFilterElement.classList.remove('ActiveFilter');
    ActiveFilterElement.value = "Any or start typing";
    getUsers(false);
}

function adjustInputElement(InputElement, reloadUsers = true) {
    let newValue = InputElement.value;

    if (newValue == "Any" || newValue == "Any or start typing" || newValue == "") {
        InputElement.classList.remove('ActiveFilter');
    } else {
        InputElement.classList.add('ActiveFilter');
    }
    if (reloadUsers) {
        getUsers(false);
    }
}

function adjustDateForFilter(InputElement, reloadUsers = true) {
    let newValue = InputElement.value;
    if (newValue == "Any" || newValue == "Any or start typing" || newValue == "") {
        InputElement.classList.remove('ActiveFilter');
    } else {
        InputElement.classList.add('ActiveFilter');
    }
    document.getElementById("Anmerkungen").focus();
    if (reloadUsers) {
        getUsers(false);
    }
}

function checkValueOfInputElement(InputElement) {
    let newValue = InputElement.value;
    let elementId = InputElement.id;
    let options = AktualLists[createListNameFromFieldName(elementId)];
    const index = options.findIndex(x => x.trim().toUpperCase() === newValue.trim().toUpperCase());
    return index;
}

let FocusedElement = function () {
    let focused = document.activeElement;
    if (!focused || focused == document.body) {
        focused = null;
    } else if (document.querySelector) {
        focused = document.querySelector(":focus");
    }
    return focused;
}

function shellForStillHerePromise(candidateForParent) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            active = FocusedElement();
            let StillHere = (active === candidateForParent);
            if (!StillHere) {
                resolve(candidateForParent);
            }
        }, 100);
    });
}

let FilterElementFocusOutEvent = function () {
    InputElement = this;
    if (this.id != "Erinnerung_Outlook") {
        let index = checkValueOfInputElement(InputElement);
        if (index > -1) {
            adjustInputElement(InputElement);
        } else {
            shellForStillHerePromise(InputElement).then(Element => {
                let index = checkValueOfInputElement(Element);
                if (index > -1) {
                    adjustInputElement(Element);
                } else {
                    Element.value = "";
                    Element.classList.remove('ActiveFilter');
                }
            });
        }
    } else {
        adjustDateForFilter(InputElement);
    }
}

let FilterElementChangeEvent = function () {
    InputElement = this;
    if (this.id != "Erinnerung_Outlook") {
        let index = checkValueOfInputElement(InputElement);
        if (index > -1) {
            adjustInputElement(InputElement);
        } else {
            this.setSelectionRange(0, 0);
        }
    } else {
        adjustDateForFilter(InputElement);
    }
}

let inputTextElementsClickEvent = function (event) {
    if (this.id != "Erinnerung_Outlook") {
        let x = event.x || event.clientX;
        let y = event.y || event.clientY;
        if (x || y) {
            this.setSelectionRange(0, this.value.length);
        }
    }
}

let createButtonGroup = (User, parentElement) => {
    let tdElement = document.createElement("td");
    if (User.editable) {
        let group = document.createElement("div");
        group.className = "btn-group";
        let BtnSzerkeszt = document.createElement("button");
        BtnSzerkeszt.className = "btn btn-info";
        let IkonSzerkeszt = document.createElement("i");
        IkonSzerkeszt.className = "fas fa-sync text-light";
        BtnSzerkeszt.appendChild(IkonSzerkeszt);
        group.appendChild(BtnSzerkeszt);
        BtnSzerkeszt.addEventListener('click', function () {
                updateUser(User.ZielKundenID, this);
            },
            false);
        let BtnTorol = document.createElement("button");
        BtnTorol.className = "btn btn-danger";
        let IkonTorol = document.createElement("i");
        IkonTorol.className = "far fa-trash-alt";
        BtnTorol.addEventListener('click', function () {
                deleteUser(User);
            },
            false);
        BtnTorol.appendChild(IkonTorol);
        group.appendChild(BtnTorol);
        tdElement.appendChild(group);
    }
    parentElement.appendChild(tdElement)
}

let CreateTD = (content, parentElement) => {
    let tdElement = document.createElement("td");
    let innerHtml = "";
    innerHtml += content;
    tdElement.innerHTML = innerHtml;
    parentElement.appendChild(tdElement)
}

function createAnyElement(name, attributes) {
    let element = document.createElement(name);
    for (let k in attributes) {
        element.setAttribute(k, attributes [k]);
    }
    return element;
}


function ResultsTableDelete() {
    let tBodyElement = document.querySelector("#resultsTable tbody");
    tBodyElement.innerHTML = "";
    let tBodyElementForNewCustomer = document.querySelector("#NewCustomerTable tbody");
    tBodyElementForNewCustomer.innerHTML = "";
    createTableRowforInput();
}

let CreateTDWithSendButton = (parentElement) => {
    let tdElement = document.createElement("td");
    let BtnSend = document.createElement("button");
    BtnSend.className = "btn btn-success";
    let IkonSend = document.createElement("i");
    IkonSend.className = "fas fa-plus-circle text-light";
    BtnSend.addEventListener('click', function () {
            uploadUser(this);
        },
        false);
    BtnSend.appendChild(IkonSend);
    tdElement.appendChild(BtnSend);
    parentElement.appendChild(tdElement);
}

let CreateTDWithInput = (content, name, parentElement, date = false) => {
    let tdElement = document.createElement("td");
    let attributes = {
        class: "form-control inputDataField",
        type: "text",
        name: name,
        value: content
    };
    if (date) {
        attributes.type = "date";
    }
    let input = createAnyElement("input", attributes);
    input.style.cursor = "text";
    tdElement.appendChild(input);
    parentElement.appendChild(tdElement);
}

let CreateTDWithDropdown = (value, parentElement, name) => {
    let tdElement = document.createElement("td");
    let divElement = createAnyElement("div", {class: "dropdown"});
    let buttonElement = createAnyElement("button", {
        class: "btn btn-secondary dropdown-toggle",
        type: "button",
        name: name + "Value",
        "data-bs-toggle": "dropdown",
        "aria-expanded": "false"
    });
    buttonElement.innerHTML = value;
    let ulElement = createAnyElement("ul", {class: "dropdown-menu", name: "dropdownMenu" + name});
    divElement.appendChild(buttonElement);
    divElement.appendChild(ulElement);
    tdElement.appendChild(divElement);
    parentElement.appendChild(tdElement);
}

let CreateTDWithICS = (ZielKundenID, szulo) => {
    let tdElement = document.createElement("td");
    let BtnICS = document.createElement("button");
    BtnICS.className = "btn btn-success";
    let IkonDownload = document.createElement("i");
    IkonDownload.className = "fas fa-download text-light";
    //IkonDownload.className = "fas fa-plus-circle text-light";
    BtnICS.addEventListener('click', function () {
            download("./backend/GetICS.php?ZielKundenID=" + ZielKundenID, "Erinnerung" + ZielKundenID + ".ics");
        },
        false);
    BtnICS.appendChild(IkonDownload);
    tdElement.appendChild(BtnICS);
    szulo.appendChild(tdElement);
}

function setDropDownOptions() {
    dropdownAdatListak =
        {
            "dropdownMenuLevel": "levelList",
            "dropdownMenuAdmin": "adminList",
        }

    let inputs = document.querySelectorAll("ul.dropdown-menu");
    for (let i = 0; i < inputs.length; i++) {
        DropDownLists[dropdownAdatListak[inputs[i].getAttribute("name")]].forEach(function (item) {
            CreateList(item, inputs[i]);
        });
    }
}

function CreateList(element, szulo) {
    var li = document.createElement('li');
    li.setAttribute('class', 'dropdown-item');
    szulo.appendChild(li);
    li.innerHTML = element;
}

let btnRefresh = function (Btn, Ertek) {
    Btn.innerHTML = Ertek;
}

let DropdownItemClickEvent = function () {
    let ujertek = this.innerHTML;
    let dropdownDiv = this.parentElement.parentElement;
    let dropdownBtn = dropdownDiv.querySelector('.btn');
    btnRefresh(dropdownBtn, ujertek)
}

function createTableRowforInput() {
    let tBodyElement = document.querySelector("#NewCustomerTable tbody");
    let trElement = document.createElement("tr");
    CreateTDWithDropdown(levelList[0], trElement, "Level");
    CreateTDWithDropdown(adminList[0], trElement, "Admin");
    CreateTDWithInput("", "Firmenname", trElement);
    CreateTDWithInput("", "NameDesKontakts", trElement);
    CreateTDWithInput("", "RechnungsAdresse", trElement);
    CreateTDWithInput("", "Ort", trElement);
    CreateTDWithInput("", "Postleitzahl", trElement);
    CreateTDWithInput("", "Land_Region", trElement);
    CreateTDWithInput("", "Telefonnummer", trElement);
    CreateTDWithInput("", "EMailAdresse", trElement);
    CreateTDWithInput("", "Erinnerung_Outlook", trElement, true);
    CreateTDWithInput("", "Anmerkungen", trElement);
    CreateTDWithSendButton(trElement);
    tBodyElement.appendChild(trElement);
}

function ResultsTableUpdate(data) {
    let resultsDiv = document.querySelector("#results");
    let talalatokSzamaStrong = document.querySelector("#talaltokSzama");
    talalatokSzamaStrong.innerHTML = data.length;
    let evetSpan = document.querySelector("#eventsSzoveg");
    evetSpan.innerHTML = (data.length == 1 ? "user meets" : "users meet");

    resultsDiv.style.display = "block";
    let tBodyElement = document.querySelector("#resultsTable tbody");
    let UserOrdinal = 1;
    for (let index in data) {
        let trElement = document.createElement("tr");
        let User = data[index];
        CreateTD(User.ZielKundenID, trElement);

        if (User.editable) {
            CreateTDWithDropdown(User.KundenPRIO, trElement, "Level");
            CreateTDWithDropdown(User.WerKummertSich, trElement, "Admin");
            CreateTDWithInput(User.Firmenname, "Firmenname", trElement);
            CreateTDWithInput(User.NameDesKontakts, "NameDesKontakts", trElement);
            CreateTDWithInput(User.RechnungsAdresse, "RechnungsAdresse", trElement);
            CreateTDWithInput(User.Ort, "Ort", trElement);
            CreateTDWithInput(User.Postleitzahl, "Postleitzahl", trElement);
            CreateTDWithInput(User.Land_Region, "Land_Region", trElement);
            CreateTDWithInput(User.Telefonnummer, "Telefonnummer", trElement);
            CreateTDWithInput(User.EMailAdresse, "EMailAdresse", trElement);
            CreateTDWithInput(User.Erinnerung_Outlook, "Erinnerung_Outlook", trElement, true);
            CreateTDWithICS(User.ZielKundenID, trElement);
            CreateTDWithInput(User.Anmerkungen, "Anmerkungen", trElement);
        } else {
            CreateTD(User.KundenPRIO, trElement);
            CreateTD(User.WerKummertSich, trElement);
            CreateTD(User.Firmenname, trElement);
            CreateTD(User.NameDesKontakts, trElement);
            CreateTD(User.RechnungsAdresse, trElement);
            CreateTD(User.Ort, trElement);
            CreateTD(User.Postleitzahl, trElement);
            CreateTD(User.Land_Region, trElement);
            CreateTD(User.Telefonnummer, trElement);
            CreateTD(User.EMailAdresse, trElement);
            CreateTD(User.Erinnerung_Outlook, trElement);
            CreateTDWithICS(User.ZielKundenID, trElement);
            CreateTD(User.Anmerkungen, trElement);
        }
        createButtonGroup(User, trElement);

        tBodyElement.appendChild(trElement);
        UserOrdinal++;
    }
    setDropDownOptions();
    let dropDownItems = document.getElementsByClassName("dropdown-item");
    for (var i = 0; i < dropDownItems.length; i++) {
        if (dropDownItems[i].addEventListener) {
            dropDownItems[i].addEventListener('click', DropdownItemClickEvent);
        }
    }
}

function resultProcess(data) {
    console.log("Backend answered the following:");
    console.log(data);
    ResultsTableDelete();
    ResultsTableUpdate(data.users);
    deleteFilterOptions();
    setFilterOptions(data.lists);
}

function deleteUser(callerUser) {
    var result = confirm("Do you want to delete " + callerUser.EMailAdresse + "?");
    if (result) {
        var Options = {};
        Options["userID"] = callerUser.ZielKundenID;
        let fetchInit =
            {
                method: "POST",
                mode: "cors",
                cache: "default",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify(Options)
            };
        const fetchData = fetch("./backend/DeleteUser.php", fetchInit);
        fetchData.then(response => response.json(), err => "Baj van!").then(response => getUsers());
    }

}

function updateUser(userID, caller) {
    let trElement = caller.parentElement.parentElement.parentElement;
    data = collectDataFromTr(trElement);
    data["ZielKundenID"] = userID;

    let fetchInit =
        {
            method: "POST",
            mode: "cors",
            cache: "default",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify(data)
        };
    const fetchData = fetch("./backend/UpdateUser.php", fetchInit);
    fetchData.then(response => response.json(), err => "Baj van!").then(response => getUsers());
}

function collectDataFromTr(trElement) {
    let inputs = trElement.querySelectorAll("input.inputDataField");
    let data = {};
    for (let i = 0; i < inputs.length; i++) {
        data[inputs[i].name] = inputs[i].value;
    }
    data["KundenPRIO"] = trElement.querySelector('button[name="LevelValue"]').innerHTML;
    data["WerKummertSich"] = trElement.querySelector('button[name="AdminValue"]').innerHTML;
    return data;
}

function uploadUser(caller) {
    let trElement = caller.parentElement.parentElement;
    data = collectDataFromTr(trElement);

    let fetchInit =
        {
            method: "POST",
            mode: "cors",
            cache: "default",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify(data)
        };
    const fetchData = fetch("./backend/RegisterUser.php", fetchInit);
    fetchData.then(response => response.json(), err => "Baj van!").then(response => getUsers());
}

function getUsers(changeFocusToResults = true, DeleteFilter = false) {
    let elem;
    var FilterOptions = {};
    activeFilters = document.getElementsByClassName('ActiveFilter');
    for (var i = 0; i < activeFilters.length; i++) {
        elem = activeFilters[i];
        if (elem.id != "Erinnerung_Outlook") {
            FilterOptions[elem.id] = elem.value;
        } else {
            FilterOptions[elem.id] = {};
            FilterOptions[elem.id]['value'] = elem.value;
            FilterOptions[elem.id]['beforeAfter'] = document.querySelector('input[name="optradio"]:checked').value;
        }

    }

    let fetchInit =
        {
            method: "POST",
            mode: "cors",
            cache: "default",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify(FilterOptions)
        };
    const fetchData = fetch("./backend/GetUsers.php", fetchInit);
    fetchData.then(data => data.json(), err => "Some error occurred!").then(data => resultProcess(data));
    if (DeleteFilter) {
        FilterElements = document.querySelectorAll(".Filter");
        for (let htmlElement of FilterElements) {
            htmlElement.value = "Any or start typing";
        }
    }
    if (changeFocusToResults) {
        window.location.href = "#results";
    }
}