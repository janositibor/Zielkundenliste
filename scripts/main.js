localStorage.clear();

levelList = ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];
adminList = ['Lars', 'Wolfgang', 'Tibor'];
DropDownLists = {
    "levelList": levelList,
    "adminList": adminList,
}




let FilterElements = document.getElementsByClassName("Filter");
for (var i = 0; i < FilterElements.length; i++) {
    if (FilterElements[i].addEventListener) {
        FilterElements[i].addEventListener('click', inputTextElementsClickEvent);
        FilterElements[i].addEventListener('focusout', FilterElementFocusOutEvent);
        FilterElements[i].addEventListener('change', FilterElementChangeEvent);
    }
}
createFilterOptions();

let ResetButtons = document.getElementsByName("Reset");
for (var i = 0; i < ResetButtons.length; i++) {
    if (ResetButtons[i].addEventListener) {
        ResetButtons[i].addEventListener('click', function () {
                reset(this);
            },
            false);
    }
}

getUsers(false, true);