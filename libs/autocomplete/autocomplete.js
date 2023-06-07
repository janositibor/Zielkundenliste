const DEFAULTS = {
  treshold: 1,
  maximumItems: 15,
  highlightTyped: true,
  highlightClass: 'text-primary',
  label: 'value',
};

class Autocomplete {
  constructor(field, list) {

  //console.log(list);
  //list=list.data;
  //console.log(Array.isArray(list));

  const belsoFormatumraKonvertalva=[];
  for (const key of list) {
    belsoFormatumraKonvertalva[key] = {'value':key};
  }
  //console.log(belsoFormatumraKonvertalva);
	
  const options={data:belsoFormatumraKonvertalva};
  //console.log(options);

    this.field = field;
    this.options = Object.assign({}, DEFAULTS, options);
    this.dropdown = null;

    field.parentNode.classList.add('dropdown');
    field.setAttribute('data-bs-toggle', 'dropdown');
    field.classList.add('dropdown-toggle');

    const dropdown = ce(`<div class="dropdown-menu"></div>`);
    if (this.options.dropdownClass)
      dropdown.classList.add(this.options.dropdownClass);

    insertAfter(dropdown, field);

    this.dropdown = new bootstrap.Dropdown(field, this.options.dropdownOptions);

    field.addEventListener('click', (e) => {
      if (this.createItems() === 0) {
        e.stopPropagation();
        this.dropdown.hide();
        
      }
    });

    field.addEventListener('input', () => {
      if (this.options.onInput)
        this.options.onInput(this.field.value);
      this.renderIfNeeded();
    });

    field.addEventListener('keydown', (e) => {
      if (e.keyCode === 27 || e.keyCode === 9) {
        this.dropdown.hide();
        return;
      }
      if (e.keyCode === 40) {
        this.dropdown._menu.children[0]?.focus();
        return;
      }
    });
  }

  clean()
    {
    this.dropdown.hide(); 
	  //let szulo=document.querySelectorAll(this.dropdown);
	  //console.log(this.dropdown._element);
    let szulo=this.dropdown._element.parentNode;
	  //console.log(szulo);
    let regi=szulo.querySelector(".dropdown-menu");
    szulo.removeChild(regi);
    szulo.classList.remove("dropdown");
    }
	hide()
		{
		this.dropdown.hide(); 
		}

  setData(data) {
    this.options.data = data;
    this.renderIfNeeded();
  }

  renderIfNeeded() {
    if (this.createItems() > 0)
      this.dropdown.show();
    else
      this.field.click();
  }

  createItem(lookup, item) {
    let label;
    if (this.options.highlightTyped) {
      const idx = item.label.toLowerCase().indexOf(lookup.toLowerCase());
      const className = Array.isArray(this.options.highlightClass) ? this.options.highlightClass.join(' ')
        : (typeof this.options.highlightClass == 'string' ? this.options.highlightClass : '');
      label = item.label.substring(0, idx)
        + `<span class="${className}">${item.label.substring(idx, idx + lookup.length)}</span>`
        + item.label.substring(idx + lookup.length, item.label.length);
    } else {
      label = item.label;
    }

    

    return ce(`<button type="button" class="dropdown-item" data-label="${item.label}" data-value="${item.label}">${label}</button>`);
  }

  createItems() {
    const lookup = this.field.value;
    if (lookup.length < this.options.treshold) {
      this.dropdown.hide();
      return 0;
    }

    const items = this.field.nextSibling;
    items.innerHTML = '';

    const keys = Object.keys(this.options.data);

    let count = 0;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const entry = this.options.data[key];
      const item = {
          label: this.options.label ? entry[this.options.label] : key,
      };

      if (item.label.toLowerCase().indexOf(lookup.toLowerCase()) >= 0) {
        items.appendChild(this.createItem(lookup, item));
        if (this.options.maximumItems > 0 && ++count >= this.options.maximumItems)
          break;
      }
    }
    /*
    console.log("nextSibling:");
    console.log(this.field.nextSibling);
    */
   this.field.nextSibling.querySelectorAll('.dropdown-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        /*
        console.log("item:");
        console.log(item);
        console.log("e:");
        console.log(e);
        */
       let dataLabel = item.getAttribute('data-label');
        /*
        console.log("dataLabel:");
        console.log(dataLabel);
        */
        this.field.value = dataLabel;
        /*
        console.log("field:");
        console.log(this.field);
        console.log(this.field.value);
        */

        if (this.options.onSelectItem) {
          this.options.onSelectItem({
            label: dataLabel
          });
        }
		this.dropdown.hide();
        //console.log(this.dropdown._element.value);
        adjustInputElement(this.dropdown._element);
      })
    });

    return items.childNodes.length;
  }
}

/**
 * @param html
 * @returns {Node}
 */
function ce(html) {
  let div = document.createElement('div');
  div.innerHTML = html;
  return div.firstChild;
}

/**
 * @param elem
 * @param refElem
 * @returns {*}
 */
function insertAfter(elem, refElem) {
  return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
}
