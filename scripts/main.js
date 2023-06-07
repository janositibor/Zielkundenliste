localStorage.clear();

levelList = ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];
adminList = ['Lars', 'Wolfgang', 'Tibor'];
DropDownLists =
    {
        "levelList": levelList,
        "adminList": adminList,
    }


let AdatListak =
    {
        "ZielKundenID": "ZielKundenIDList",
        "KundenPRIO": "KundenPRIOList",
        "WerKummertSich": "WerKummertSichList",
        "Firmenname": "FirmennameList",
        "NameDesKontakts": "NameDesKontaktsList",
        "RechnungsAdresse": "RechnungsAdresseList",
        "Ort": "OrtList",
        "Postleitzahl": "PostleitzahlList",
        "Land_Region": "Land_RegionList",
        "Telefonnummer": "TelefonnummersList",
        "EMailAdresse": "EMailAdresseList",
        "Anmerkungen": "AnmerkungenList",
    }
let AktualLists = {};
let Lists = {};

function download(dataurl, filename) {
    const link = document.createElement("a");
    link.href = dataurl;
    link.download = filename;
    link.click();
}

function createFilterOptions() {
    console.log("createFilterOptions meghívva!");

    let i = 0;
    for (let k in AdatListak) {
        //console.log(k);
        let htmlElem = document.getElementById(k);
        //console.log(htmlElem);
        let betoltendoLista = ["Any"];
        //console.log(betoltendoLista);
        window['ac_' + i] = new Autocomplete(htmlElem, betoltendoLista);
        i++;
    }
}

function setFilterOptions(Lists) {
    let i = 0;
    for (let k in AdatListak) {
        //console.log(k);
        let htmlElem = document.getElementById(k);
        //console.log(htmlElem);
        let betoltendoLista = Lists[AdatListak[k]];
        //console.log(betoltendoLista);
        AktualLists[AdatListak[k]] = betoltendoLista;
        window['ac_' + i] = new Autocomplete(htmlElem, betoltendoLista);
        //console.log(window['ac_' + i]);
        i++;
    }
}

function deleteFilterOptions() {
    let i = 0;
    for (let k in AdatListak) {
        window['ac_' + i].clean();
        delete window['ac_' + i];
        i++;
    }
}

function hideFilterOptions() {
    let i = 0;
    for (let k in AdatListak) {
        window['ac_' + i].hide();
        i++;
    }
}

function reset(caller) {
    let divElement = caller.parentElement;

    ActiveFilterElement = divElement.querySelector("input.Filter");

    ActiveFilterElement.classList.remove('ActiveFilter');
    ActiveFilterElement.value = "Any or start typing";

    lekeres(false);
}


function adjustInputElement(InputElement, lekeressel = true) {
    let ujertek = InputElement.value;

    if (ujertek == "Any" || ujertek == "Any or start typing" || ujertek == "") {
        InputElement.classList.remove('ActiveFilter');
    } else {
        InputElement.classList.add('ActiveFilter');
    }
    if (lekeressel) {
        //console.log("lekeres Inditva");
        lekeres(false);
    }
}

function adjustDateForFilter(InputElement, lekeressel = true) {
    let ujertek = InputElement.value;

    if (ujertek == "Any" || ujertek == "Any or start typing" || ujertek == "") {
        InputElement.classList.remove('ActiveFilter');
    } else {
        InputElement.classList.add('ActiveFilter');
    }

    document.getElementById("Anmerkungen").focus();

    if (lekeressel) {
        lekeres(false);
    }
}

function checkValueOfInputElement(InputElement) {
    let ujertek = InputElement.value;
    let elementId = InputElement.id;
    let HelyesErtekek = AktualLists[AdatListak[elementId]];
    const index = HelyesErtekek.findIndex(x => x.trim().toUpperCase() === ujertek.trim().toUpperCase());
    return index;
}

let FocusedElement = function () {
    var focused = document.activeElement;
    if (!focused || focused == document.body) {
        focused = null;
    } else if (document.querySelector) {
        focused = document.querySelector(":focus");
        //console.log("focused (document.querySelector):");
        //console.log(focused);
    }
    return focused;
}


function shellForStillHerePromise(szuloJelolt) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            active = FocusedElement();
            let StillHere = (active === szuloJelolt);
            if (!StillHere) {
                resolve(szuloJelolt);
            }
        }, 100);

    });
}

function FilterOptionUpdate() {
    deleteFilterOptions();
    setFilterOptions(Lists);

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


let createButtonGroup = (User, szulo) => {
    let tdElement = document.createElement("td");

    if (User.editable)
    {
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

    szulo.appendChild(tdElement)
}

let CreateTD = (tartalom, szulo) => {
    let tdElement = document.createElement("td");
    let innerHtml = "";
    innerHtml += tartalom;

    tdElement.innerHTML = innerHtml;
    szulo.appendChild(tdElement)
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

let CreateTDWithSendButton = (szulo) => {
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
    szulo.appendChild(tdElement);
}

let CreateTDWithInput = (tartalom, name, szulo) => {
    let tdElement = document.createElement("td");
    let input = createAnyElement("input", {
        class: "form-control inputDataField",
        type: "text",
        name: name,
        value: tartalom
    });
    input.style.cursor = "text";
    tdElement.appendChild(input);

    szulo.appendChild(tdElement);
}
let CreateTDWithDate = (tartalom, name, szulo) => {
    let tdElement = document.createElement("td");
    let input = createAnyElement("input", {
        class: "form-control inputDataField",
        name: name,
        type: "date",
        value: tartalom
    });
    tdElement.appendChild(input);

    szulo.appendChild(tdElement);
}
let CreateTDWithDate_NOK = (tartalom, name, szulo) => {
    let tdElement = document.createElement("td");
    let input = createAnyElement("input", {name: name, type: "date", value: tartalom});

    tdElement.appendChild(input);

    szulo.appendChild(tdElement);
}
let CreateTDWithDate_NOK2 = (tartalom, name, szulo) => {
    let tdElement = document.createElement("td");
    let divElement = createAnyElement("div", {class: "input-group date"});
    let inputElement = createAnyElement("input", {class: "form-control", type: "text", value: tartalom});
    let spanElement = createAnyElement("span", {class: "input-group-addon"});
    let iElement = createAnyElement("span", {class: "glyphicon glyphicon-th"});
    $(function () {
        $('.input-group.date').datepicker();
    });
    spanElement.appendChild(iElement);
    inputElement.appendChild(spanElement);
    divElement.appendChild(inputElement);
    tdElement.appendChild(divElement);

    szulo.appendChild(tdElement);
}
let CreateTDWithLevelDropdown = (value, szulo) => {
    let tdElement = document.createElement("td");
    let divElement = createAnyElement("div", {class: "dropdown"});
    let buttonElement = createAnyElement("button", {
        class: "btn btn-secondary dropdown-toggle",
        type: "button",
        name: "LevelValue",
        "data-bs-toggle": "dropdown",
        "aria-expanded": "false"
    });
    buttonElement.innerHTML = value;
    let ulElement = createAnyElement("ul", {class: "dropdown-menu", name: "dropdownMenuLevel"});
    divElement.appendChild(buttonElement);
    divElement.appendChild(ulElement);
    tdElement.appendChild(divElement);
    szulo.appendChild(tdElement);
}
let CreateTDWithAdminDropdown = (value, szulo) => {
    let tdElement = document.createElement("td");
    let divElement = createAnyElement("div", {class: "dropdown"});
    let buttonElement = createAnyElement("button", {
        class: "btn btn-secondary dropdown-toggle",
        name: "AdminValue",
        type: "button",
        "data-bs-toggle": "dropdown",
        "aria-expanded": "false"
    });
    buttonElement.innerHTML = value;
    let ulElement = createAnyElement("ul", {class: "dropdown-menu", name: "dropdownMenuAdmin"});
    divElement.appendChild(buttonElement);
    divElement.appendChild(ulElement);
    tdElement.appendChild(divElement);
    szulo.appendChild(tdElement);
}
let CreateTDWithICS = (ZielKundenID, szulo) => {
    let tdElement = document.createElement("td");
    let BtnICS = document.createElement("button");
    BtnICS.className = "btn btn-success";
    let IkonDownload = document.createElement("i");
    IkonDownload.className = "fas fa-download text-light";
    //IkonDownload.className = "fas fa-plus-circle text-light";
    BtnICS.addEventListener('click', function () {
            download("./DB/GetICS.php?ZielKundenID=" + ZielKundenID, "Erinnerung" + ZielKundenID + ".ics");
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
    //let ul=document.getElementById("dropdownMenuTour");
    //adminList.forEach(function (item) { CreateList(item, ul); });
    //console.log("in setDropDownOptions. this:")

    let inputs = document.querySelectorAll("ul.dropdown-menu");
    for (let i = 0; i < inputs.length; i++) {
        DropDownLists[dropdownAdatListak[inputs[i].getAttribute("name")]].forEach(function (item) {
            CreateList(item, inputs[i]);
        });
        ;
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
    CreateTDWithLevelDropdown(levelList[0], trElement);
    CreateTDWithAdminDropdown(adminList[0], trElement);
    CreateTDWithInput("", "Firmenname", trElement);
    CreateTDWithInput("", "NameDesKontakts", trElement);
    CreateTDWithInput("", "RechnungsAdresse", trElement);
    CreateTDWithInput("", "Ort", trElement);
    CreateTDWithInput("", "Postleitzahl", trElement);
    CreateTDWithInput("", "Land_Region", trElement);
    CreateTDWithInput("", "Telefonnummer", trElement);
    CreateTDWithInput("", "EMailAdresse", trElement);
    CreateTDWithDate("", "Erinnerung_Outlook", trElement);
    CreateTDWithInput("", "Anmerkungen", trElement);
    CreateTDWithSendButton(trElement);
    ;
    tBodyElement.appendChild(trElement);
}

function ResultsTableUpdate(data, songListToHighlight) {
    let resultsDiv = document.querySelector("#results");
    //console.log(data.length);
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
        //console.log(User);
        CreateTD(User.ZielKundenID, trElement);

        if (User.editable) {
            CreateTDWithLevelDropdown(User.KundenPRIO, trElement);
            CreateTDWithAdminDropdown(User.WerKummertSich, trElement);
            CreateTDWithInput(User.Firmenname, "Firmenname", trElement);
            CreateTDWithInput(User.NameDesKontakts, "NameDesKontakts", trElement);
            CreateTDWithInput(User.RechnungsAdresse, "RechnungsAdresse", trElement);
            CreateTDWithInput(User.Ort, "Ort", trElement);
            CreateTDWithInput(User.Postleitzahl, "Postleitzahl", trElement);
            CreateTDWithInput(User.Land_Region, "Land_Region", trElement);
            CreateTDWithInput(User.Telefonnummer, "Telefonnummer", trElement);
            CreateTDWithInput(User.EMailAdresse, "EMailAdresse", trElement);
            CreateTDWithDate(User.Erinnerung_Outlook, "Erinnerung_Outlook", trElement);
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
    //console.log(dropDownItems);
    for (var i = 0; i < dropDownItems.length; i++) {
        if (dropDownItems[i].addEventListener) {
            dropDownItems[i].addEventListener('click', DropdownItemClickEvent);
        }
    }
    //setFilterOptions();
}


function InsertMonthAndDaylist(data) {
    data.Lists.MonthAndDaylist = [];
    let esemeny;
    for (let index in data.Concerts) {
        //console.log(index)
        esemeny = data.Concerts[index];
        ertek = esemeny.Month.toString() + "-" + esemeny.Day.toString();
        data.Lists.MonthAndDaylist.push(ertek);
    }
}

function resultFeldolg(data) {
    console.log("Válasz:");
    console.log(data);
    //InsertMonthAndDaylist(data);
    //console.log("MonthAndDayIncluded:");
    //console.log(data);

    ResultsTableDelete();
    ResultsTableUpdate(data.Kunden);
    //FilterOptionUpdate(data.Lists);
    deleteFilterOptions();
    //setFilterOptions(Lists_Alap);
    setFilterOptions(data.Lists);
    Lists = data.Lists;
    //console.log("resultFeldolg vége");
}

function deleteUser(callerUser) {
    var result = confirm("Do you want to delete " + callerUser.EMailAdresse + "?");
    if (result) {
        //console.log(callerUser.ZielKundenID);
        var Options = {};
        Options["userID"] = callerUser.ZielKundenID;
        let fetchInit =
            {
                method: "POST",
                headers: new Headers(),
                mode: "cors",
                cache: "default",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify(Options)
            };
        const fetchData = fetch("./DB/DeleteUser.php", fetchInit);
        //fetchData.then(data => data.json(),err => "Baj van!").then(data => console.log(data));
        fetchData.then(response => response.json(), err => "Baj van!").then(response => lekeres());
    }

}

function updateUser(userID, caller) {
    let trElement = caller.parentElement.parentElement.parentElement;
    //console.log(trElement);

    data = collectDataFromTr(trElement);
    data["ZielKundenID"] = userID;

    let fetchInit =
        {
            method: "POST",
            headers: new Headers(),
            mode: "cors",
            cache: "default",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify(data)
        };
    const fetchData = fetch("./DB/UpdateUser.php", fetchInit);
    //fetchData.then(data => data.json(),err => "Baj van!").then(data => console.log(data));
    fetchData.then(response => response.json(), err => "Baj van!").then(response => lekeres());
}

function collectDataFromTr(trElement) {
    let inputs = trElement.querySelectorAll("input.inputDataField");
    let data = {};
    for (let i = 0; i < inputs.length; i++) {
        data[inputs[i].name] = inputs[i].value;
    }
    /*
    console.log(data);
    buttonElement=trElement.querySelector('button[name="LevelValue"]');
    //ulElement=trElement.querySelector("#dropdownMenuLevel");
    console.log(buttonElement);
    console.log(buttonElement.innerHTML);
    */
    data["KundenPRIO"] = trElement.querySelector('button[name="LevelValue"]').innerHTML;
    data["WerKummertSich"] = trElement.querySelector('button[name="AdminValue"]').innerHTML;
    /*
    console.log(datePickerElement);
    console.log(datePickerElement.innerHTML);
    console.log(datePickerElement.value);
    console.log(data);
    */
    return data;
}

function uploadUser(caller) {
    //console.log(caller);
    let trElement = caller.parentElement.parentElement;
    //console.log(trElement);

    data = collectDataFromTr(trElement);

    let fetchInit =
        {
            method: "POST",
            headers: new Headers(),
            mode: "cors",
            cache: "default",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify(data)
        };
    const fetchData = fetch("./DB/RegisterUser.php", fetchInit);
    //fetchData.then(data => data.json(),err => "Baj van!").then(data => console.log(data));
    fetchData.then(response => response.json(), err => "Baj van!").then(response => lekeres());
}

function lekeres(Btn = true, DeleteFilter = false) {
    //console.log("lekeres indítva");
    let elem;
    var FilterOptions = {};
    //console.log(Options);
    activeFilters = document.getElementsByClassName('ActiveFilter');
    //console.log(activeFilters);
    for (var i = 0; i < activeFilters.length; i++) {
        elem = activeFilters[i];
        //console.log(elem);
        if (elem.id != "Erinnerung_Outlook") {
            FilterOptions[elem.id] = elem.value;
        } else {
            FilterOptions[elem.id] = {};
            FilterOptions[elem.id]['value'] = elem.value;
            FilterOptions[elem.id]['beforeAfter'] = document.querySelector('input[name="optradio"]:checked').value;
        }

    }
    console.log("FilterOptions:");
    console.log(FilterOptions);

    /*
    let Options = {
        name: "Peter Big",
        age: 21
    };
    */
    let fetchInit =
        {
            method: "POST",
            headers: new Headers(),
            mode: "cors",
            cache: "default",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify(FilterOptions)
        };
    const fetchData = fetch("./DB/GetUsers.php", fetchInit);
    //fetchData.then(data => data.json(),err => "Baj van!").then(data => console.log(data));
    fetchData.then(data => data.json(), err => "Baj van!").then(data => resultFeldolg(data));
    if (DeleteFilter) {
        FilterElements = document.querySelectorAll(".Filter");
        for (let htmlElement of FilterElements) {
            htmlElement.value = "Any or start typing";
        }
    }
    if (Btn) {
        window.location.href = "#results";
    }
}

/*
let SearchBtn=document.getElementById("Search");
SearchBtn.addEventListener('click', lekeres);
*/
//setFilterOptions(Lists_Alap);
let FilterElements = document.getElementsByClassName("Filter");
//console.log(FilterElements);
for (var i = 0; i < FilterElements.length; i++) {
    //console.log(FilterElements[i]);
    if (FilterElements[i].addEventListener) {
        FilterElements[i].addEventListener('click', inputTextElementsClickEvent);
        FilterElements[i].addEventListener('focusout', FilterElementFocusOutEvent);
        FilterElements[i].addEventListener('change', FilterElementChangeEvent);
    }
}
createFilterOptions();
/*
let inputTextElements=document.getElementsByClassName("inputText");
//console.log(inputTextElements);
for (var i = 0; i < inputTextElements.length; i++) 
	{
	if (inputTextElements[i].addEventListener) 
		{
        inputTextElements[i].addEventListener('click', inputTextElementsClickEvent);
		} 
	}
	*/

let ResetButtons = document.getElementsByName("Reset");
//console.log(FilterElements);
for (var i = 0; i < ResetButtons.length; i++) {
    //console.log(FilterElements[i]);
    if (ResetButtons[i].addEventListener) {
        ResetButtons[i].addEventListener('click', function () {
                reset(this);
            },
            false);
    }
}

lekeres(false, true);