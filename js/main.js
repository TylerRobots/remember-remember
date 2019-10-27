
const LANG = { /* EN */
    'header-main'               : "Remember, remember, things I want to remember",
    'header-1'                  : "Add items, stories and thoughts",
    'header-2'                  : "Pick a category, filter the query",
    'header-3'                  : "Things to not be forgot",

    
    'form-label-id'             : "ID",
    'form-label-name'           : "Name/Description",
    'form-label-parent-id'      : "Parent ID (optional)",
    'form-label-category'       : "Category (optional)",
    'form-label-subcategory'    : "Subcategory (optional)",
    'form-label-status'         : "Status/Priority",
    'form-label-favorite'       : "Favorite",
    
    'default-value-description' : "Enter a description or name",
    'default-value-parent-id'   : "",
    'default-value-category'    : "",
    'default-value-subcategory' : "",
    'default-value-status'      : "0",
    'default-value-favorite'    : false,
    'default-value-add'         : "Add",
    'default-value-delete'      : "Delete",
    'delete-confirm'            : "Please confirm.",
    'default-value-delete-confirm': "Delete",

    'priority-n-3'              : "-3",
    'priority-n-2'              : "-2",
    'priority-n-1'              : "-1",
    'priority-n01'              : "1",
    'priority-n02'              : "2",
    'priority-n03'              : "3",
    'priority-n04'              : "4",
    'priority-n05'              : "5",

    'priority-w-3'              : "Removed",
    'priority-w-2'              : "Archived",
    'priority-w-1'              : "Completed",
    'priority-w00'              : "No Priority",
    'priority-w01'              : "Low",
    'priority-w02'              : "Low-medium",
    'priority-w03'              : "Medium",
    'priority-w04'              : "Medium-high",
    'priority-w05'              : "High",

    'th-id'                     : "ID",
    'th-name'                   : "Name/Description",
    'th-parent-id'              : "",
    'th-category'               : "Category",
    'th-subcategory'            : "Subcategory",
    'th-status'                 : "!",
    'th-favorite'               : "Favorite"
};

window.localStorage.setItem( "keyIndex", 0 );
window.localStorage.setItem( "lastSync", "" );
window.localStorage.setItem( "rememberedThings", JSON.stringify( {} ) );

/**
 * 
 * Common Functions
 * 
 */


/**
 * datetimeString creates a SQL formatted datetime string using a defined 
 * *time* and the current *time*, `now` as the default.
 * @param {*} time 
 */
function datetimeString( time="now" ) {
    
    let year, month, day, hour, minute, second;
    let date = new Date;

    year = String( date.getFullYear() );
    month = String( date.getMonth() ).padStart( 2, 0 );
    day = String( date.getDate() ).padStart( 2, 0 );
    hour = String( date.getHours() ).padStart( 2, 0 );
    minute = String( date.getMinutes() ).padStart( 2, 0 );
    second = String( date.getSeconds() ).padStart( 2, 0 );

    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;

}


/**
 * 
 * @param {*} elementID 
 */
function getInput( elementID ) {

    let element = document.getElementById( elementID );
    let elementValue;

    // Checkboxes and Radios
    if( element.type === "checkbox" ) {

        elementValue = element.checked;
        return elementValue;

    }

    // Select options
    if( element.tagName === "SELECT" ) {

        elementValue = element.options[element.selectedIndex].value;
        return elementValue;

    }

    /**
     * Text inputs, button values, and other text value based inputs. This is 
     * the fallback for non-captured input types.
     */
    elementValue = element.value;

    return elementValue;

}


/**
 * 
 * @param {*} elementID Select an element by ID
 * @param {*} value Assign a value to elementID
 */
function setInput( elementID, value ) {
    
    let elementValue = document.getElementById( elementID ).value = value;
    
    return elementValue;
    
}


/**
 * 
 * @param {*} elementID Select an element by ID
 */
function togglePopup( elementID ) {

    document.getElementById( elementID ).classList.toggle( "hidden" );

}


/**
 * 
 * List Management
 * 
 */


 /**
  * 
  */
function getLastID() {

    let rememberedThings = getRememberedThings();
    let lastID = objectLength( rememberedThings );

    return Number( lastID );

}


function getRememberedThings() {

    let rememberedThings = JSON.parse( window.localStorage.getItem( "rememberedThings" ) );

    return rememberedThings;

}

function removeRememberedThing( thingID ) {

    let thingElement = document.getElementById( "item-" + thingID );
    thingElement.parentNode.removeChild( thingElement );

    let rememberedThings = getRememberedThings();
    let selectedThing = rememberedThings[thingID];
    rememberedThings[thingID].statusPriority = "-3";
    window.localStorage.setItem( "rememberedThings", JSON.stringify( rememberedThings ) );

    return rememberedThings;

}


/**
 * https://stackoverflow.com/a/16976927
 * @param {*} object 
 */
function objectLength( object ) {

    var length = 0;

    for( var key in object ) {
        if( object.hasOwnProperty( key ) ) {
            ++length;
        }
    }

    return length;
}


/**
 * 
 */
function createTableRow( thing ) {

    let elementID = "table-header";

    let node = document.createElement( "div" );
    node.setAttribute( "class", "remember__table__tr remember__table__tr--priority__" + thing.statusPriority );
    node.setAttribute( "id", "item-" + thing.id );
    let nodePosition = document.getElementById( elementID ).parentElement;
    nodePosition.insertBefore(node, nodePosition[1]);

    let tableRow = `
        <div class="remember__table__td__priority">
            ${thing.statusPriority}
        </div>
        <div class="remember__table__td__id">
            ${thing.id}
        </div>
        <div class="remember__table__td__description">
            ${thing.description}
        </div>
        <div class="remember__table__td__category">
            ${thing.category}
        </div>
        <div class="remember__table__td__subcategory">
            ${thing.subcategory}
        </div>
        <div class="remember__table__td__date">
            ${thing.dateCreated}
            ${thing.dateModified}
        </div>
        <div class="remember__table__td__actions">
        <span>
            <select class="remember__table_td__actions__input__status-priority" id="status-priority-${thing.id}" name="statusPriority">
                <option value="-1">Complete</option>
                <option value="0">No Priority</option>
                <option value="1">1 (low)</option>
                <option value="2">2</option>
                <option value="3">3 (medium)</option>
                <option value="4">4</option>
                <option value="5">5 (high)</option>
            </select>
        </span>

        <span>
            <label for="favorite-${thing.id}">
                    Favorite
            </label>
            <input id="favorite-${thing.id}" name="favorite" type="checkbox" />
        </span>

        <span>
            <input
            id="delete-${thing.id}"
            type="button"
            value="Delete"
            onclick="togglePopup('dialog-box__confirm-delete-${thing.id}');"
            />
            <div id="dialog-box__confirm-delete-${thing.id}" class="remember__table__td__actions__dialog-box hidden">
                <div class="disable-screen" onclick="togglePopup('dialog-box__confirm-delete-${thing.id}');">
                    
                </div>
                <div class="dialog">
                    <p>
                        Please confirm.
                    </p>
                    <input
                        id="confirm-delete-${thing.id}"
                        type="button"
                        value="Delete"
                        onclick="removeRememberedThing('${thing.id}');"
                    />
                </div>
            </div>
        </span>
        </div>
    `;

    document.getElementById( "item-" + thing.id ).innerHTML = tableRow;

}

    // class="remember__table__tr" id="item-{id}"></div>

/**
 * 
 */
function removeTableRow() {

}

/**
 * 
 */
function removeAllTableRows() {

}

/**
 * 
 */
function sortTableBy() {

}

/**
 * 
 */
function filterTableBy() {

}


/**
 * 
 * @param {*} newThing 
 */
function saveLocalStorage( newThing ) {
    let rememberedThings = getRememberedThings();

    console.log( rememberedThings );
    rememberedThings[newThing.id] = newThing;
    
    window.localStorage.setItem( "keyIndex", newThing.id );
    window.localStorage.setItem( "lastSync", datetimeString() );
    window.localStorage.setItem( "rememberedThings", JSON.stringify( rememberedThings ) );

}


/**
 * 
 * Error Management
 * 
 */


/**
 * 
 * @param {*} elementID 
 */
function clearErrors( elementID ) {

    let elementValue = document.getElementById( elementID ).innerHTML = "";

    return true;

}


/**
 * 
 * @param {*} elementID 
 * @param {*} errors 
 */
function handleErrors( elementID, errors ) {

    return( errors.length > 0 ? setErrors( elementID, errors ) : clearErrors( elementID ) );

}


/**
 * 
 * @param {*} errors 
 */
function listErrors( errors ) {

    let errorMsg = "";

    if( errors.length > 0 ) {
        errorMsg = "<ul>";

        for( error of errors ) {
            errorMsg = errorMsg + "<li>" + error + "</li>";
        }

        errorMsg = errorMsg + "</ul>";
    }

    return errorMsg;

}


/**
 * 
 * @param {*} elementID 
 * @param {*} value 
 */
function setErrors( elementID, errors ) {

    clearErrors( elementID );
    let errorList = listErrors( errors );
    let elementValue = document.getElementById( elementID ).innerHTML = errorList;

    return elementValue;

}



/**
 * 
 * Description - Name
 * 
 */


/**
 * 
 */
function clearDefaultDescription() {

    let elementID = "description";

    if( getInput( elementID ) === LANG['description-default'] ){

        return setInput( elementID, "" );

    }

}


/**
 * 
 */
function resetDefaultDescription() {

    let elementID = "description";
    let errors = [];

    if( getInput( elementID ) == "" ) {

        errors[0] = "Name/Description is required.";

        setErrors( elementID + "-error", errors );

        return setInput( elementID, LANG['description-default'] );

    }

}

/**
 * 
 * Return value is a list of errors if any.
 * @param {*} elementID 
 * @param {*} callback 
 */
function validateInput( elementID, callback ) {

    let value = getInput( elementID );
    errors = callback( value );
    
    return handleErrors( elementID + "-error", errors );

}

/**
 * 
 */
function validateDescription() {
    
    function checkDescriptionRules( value ) {
        let errors = [];

        if( value === "" || value == LANG.descriptionDefault ) {
            errors[0] = "Name/Description is required."
        }

        if( value.length < 3 ) {
            errors[1] = `The Name/Description must be between 3 and 256 characters long.`;
        }

        if( value.search( /^[ a-zA-Z0-9!._-]+$/ ) ) {
            errors[2] = `The Name/Description can only contain alpha-numeric characters, dashes, spaces, and underscores.`;
        }

        return errors;
    }
    
    return validateInput( "description", checkDescriptionRules );

}


/**
 * 
 */
function validateParentID() {

    function checkParentIDRules( value ) {
        let errors = [];
        
        if( value !== "" ) {
            if( Number( value ) != value ) {
                errors[0] = "Parent ID must be a number.";
            }
            if( false ) { // TODO
                errors[1] = "Parent ID must be a the ID of an existing <i>thing</i>.";
            }
        }

        return errors;
    }

    return validateInput( "parent-id", checkParentIDRules );

}


/**
 * 
 */
function validateCategory() {

    function checkCategoryRules( value ) {
        let errors = [];
        
        if( value.search( /^[ a-zA-Z0-9!._-]+$/ ) ) {
            errors[0] = `The Category can only contain alphanumeric characters, dashes, spaces, and underscores.`;
        }

        return errors;
    }

    return validateInput( "category", checkCategoryRules );

}


/**
 * 
 */
function validateSubcategory() {

    function checkSubcategoryRules( value ) {
        let errors = [];
        
        if( value.search( /^[ a-zA-Z0-9!._-]+$/ ) ) {
            errors[0] = `The Subcategory can only contain alphanumeric characters, dashes, spaces, and underscores.`;
        }

        return errors;
    }

    return validateInput( "subcategory", checkSubcategoryRules );

}


/**
 * 
 */
function validateStatusPriority() {
    return true; // TODO
}


/**
 * 
 */
function validateFavorite() {

    function checkFavoriteRules( value ) {
        errors = [];
        
        if( value === true || value === false ) {
            return true;
        }
    }

    return validateInput( "favorite", checkFavoriteRules );

}


/**
 * 
 */
function validateForm() {

    if( validateDescription() === true &&
        validateParentID() === true &&
        validateCategory() === true &&
        validateSubcategory() === true &&
        validateStatusPriority() === true &&
        validateFavorite() === true
    ) {
        return true;
    }

    return false;

}


function StatusPriorityToLanguage() {

}


/**
 * 
 */
function compileFormToThing() {

    let thing = { 
            "id": getLastID() + 1,
            "description": getInput( "description" ),
            "parentID": getInput( "parent-id" ),
            "category": getInput( "category" ),
            "subcategory": getInput( "subcategory" ),
            "statusPriority": getInput( "status-priority" ),
            "favorite": getInput( "favorite" ),
            "dateCreated": datetimeString(),
            "dateModified": "0000-00-00 00:00:00"
    };

    return thing;

}


/**
 * 
 */
let rememberRemember = function() {

    if( validateForm() === true ) {

        let thing = compileFormToThing();

        remembering( thing );
        
    }
    
}


function remembering( thing ) {

    saveLocalStorage( thing );
    
    createTableRow( thing );

    if( connected=true )  {

        // TODO

    }
    
}