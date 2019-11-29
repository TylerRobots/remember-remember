/**
 * Common Functions
 * * datetimeString( time="now" )
 * * objectLength( object )
 * * togglePopup( elementID )    
 * Forms and Inputs
 * * compileFormToThing()
 * * getInput( elementID )
 * * preCheck( option )
 * * preSelect( option, toMatch )
 * * setInput( elementID, value )
 * List Management
 * * statusNameToValue()
 * * statusValueToName()
 * * addRemember()
 * Getters
 * * getLastID()
 * * getRememberedThings()
 * Setters
 * * createLocalStorage()
v * * removeRememberedThing( thingID )
v * * saveLocalStorage( newThing )
v * * updateRememberedThing( thingID )
updateDescription()
updateCategory()
updateTags()
updateStatus()
updateFavorite()
 * Database
 * * saveRemoteStorage() //TODO
 * * testRemoteConnection() //TODO
 * Filters and Mappers
 * * filter()
 * * filterRemoved()
 * * sort() // TODO
 * Document Model
 * * createTableRow( thing )
 * * createTableView( things )
 * * removeAllTableRows()         // no rows to remove, UI TODO
 * * removeTableRow( thingID )
 * UI Feedback
 * * clearDefaultDescription()
 * * resetDefaultDescription()
 flagToSave()
 * * statusClassName( status )
 * Error Service
 * * clearErrors( elementID )
 * * handleErrors( elementID, errors )
 * * listErrors( errors )
 * * setErrors( elementID, errors )
 * Input Validators
 * * validateInput( elementID, callback )
 * * validateDescription()
 * * validateParentID()            if( false )  // TODO
 * * validateCategory()
 * * validateTags()
 * * validateStatus()    return true; // TODO
 * * validateFavorite()
 * * validateForm()
 * External
 * * exportRememberRemember() // TODO
 * * importRememberRemember() // TODO - CSV, JSON
*/

let saveQueue = {};

createLocalStorage() ? true : createTableView( getRememberedThings() );

/**
 * 
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
    month = String( date.getMonth() + 1 ).padStart( 2, 0 );
    day = String( date.getDate() ).padStart( 2, 0 );
    hour = String( date.getHours() ).padStart( 2, 0 );
    minute = String( date.getMinutes() ).padStart( 2, 0 );
    second = String( date.getSeconds() ).padStart( 2, 0 );
    
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    
}

/**
 * 
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
 * @param {*} elementID 
 * @param {*} className 
 */
function toggleClass( elementID, className ) {

    document.getElementById( elementID ).classList.toggle( className );

}

/**
 * 
 * @param {*} elementID Select an element by ID
 */
function togglePopup( elementID ) {

    toggleClass( elementID, "hidden" );

}

/**
 * 
 * @param {*} elementID 
 */
function toggleTableRow( elementID ) {

    toggleClass( elementID, "show-details" );

}

/**
 * 
 * 
 * Forms and Inputs
 * 
 */

/**
 * 
 */
function compileFormToThing() {

    let thing = { 
            "id": getLastID() + 1,
            "description": getInput( "description" ),
            "parentID": getInput( "parent-id" ),
            "category": getInput( "category" ),
            "tags": getInput( "tags" ),
            "status": getInput( "status" ),
            "favorite": getInput( "favorite" ),
            "dateCreated": datetimeString(),
            "dateModified": "0000-00-00 00:00:00"
    };

    return thing;

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
    if( element.tagsName === "SELECT" ) {

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
 * @param {*} option 
 */
function preCheck( option ) {

    return option == true ? "checked" : "";

}

/**
 * 
 * @param {*} option 
 * @param {*} toMatch 
 */
function preSelect( option, toMatch ) {

    return option == toMatch ? "selected" : "";

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
 * 
 * List Management
 * 
 */

function statusNameToValue() {

    // TODO

}

/**
 * 
 */
function statusValueToName() {

    // TODO

}

/**
 * 
 */
function addRemember() {

    if( validateForm() === true ) {

        let thing = compileFormToThing();

        saveLocalStorage( thing );
        
        createTableRow( thing );
        
        if( testRemoteConnection() )  {
        
            saveRemoteStorage();
        
        }
        
    }
    
}

function queueSave( thingID, propertyName ) {

    let capitalPropertyName = propertyName.replace( /^./, propertyName[0].toUpperCase() );
    let validator = validate + propertyName;

    if( validator() ) {
        saveQueue = {
            thingID : {
                propertyName : getInput( propertyName + "-" + thingID )
            }
        }
    }
}

/**
 * 
 * 
 * Getters
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

/**
 * 
 */
function getRememberedThings() {
    
    let rememberedThings = JSON.parse( window.localStorage.getItem( "rememberedThings" ) );
    
    return rememberedThings;
    
}

/**
 * 
 * 
 * Setters
 * 
 */

/**
 * 
 */
function createLocalStorage() {

    if( window.localStorage.getItem( "lastSync" ) === null ) {

        window.localStorage.setItem( "keyIndex", 0 );
        window.localStorage.setItem( "lastSync", "" );
        window.localStorage.setItem( "rememberedThings", JSON.stringify( {} ) );

        return true;

    }

    return false;
    
}

/**
 * 
 * @param {*} thingID 
 */
function removeRememberedThing( rememberedThings, thingID ) {

    rememberedThings[thingID].status = "-3";
    
    removeTableRow( thingID );

    return rememberedThings;

}

/**
 * 
 * @param {*} newThing
 */
function saveLocalStorage( newThing ) {
    let rememberedThings = getRememberedThings();

    rememberedThings[newThing.id] = newThing;
    
    window.localStorage.setItem( "keyIndex", newThing.id );
    window.localStorage.setItem( "lastSync", datetimeString() );
    window.localStorage.setItem( "rememberedThings", JSON.stringify( rememberedThings ) );

}

/**
 * 
 * @param {*} thingID 
 * @param {*} callback 
 */
function updateRememberedThing( thingID, callback ) {

    let rememberedThings = getRememberedThings();

    callback(rememberedThings, thingID);
    rememberedThings[thingID].dateModified = datetimeString();
    window.localStorage.setItem( "rememberedThings", JSON.stringify( rememberedThings ) );

    return rememberedThings;

}

function updateDescription() {

    rememberedThings[thingID].description = getInput( "description-" + thingID );
    
}

function updateCategory() {

    rememberedThings[thingID].category = getInput( "category-" + thingID );

}

function updateTags() {

    rememberedThings[thingID].tags = getInput( "tags-" + thingID );

}

function updateStatus( rememberedThings, thingID ) {

    rememberedThings[thingID].status = getInput( "status-" + thingID );

}

function updateFavorite( rememberedThings, thingID ) {

    rememberedThings[thingID].favorite = getInput( "favorite-" + thingID );

}

/**
 * 
 * 
 * Database
 * 
 */

/**
 * 
 */
function saveRemoteStorage() {

    //TODO

}
    
/**
 * 
 */        
function testRemoteConnection() {

    //TODO

}

/**
 * 
 * 
 * Filters and Reducers
 * 
 */

/**
 * 
 * @param {*} things 
 * @param {*} prop 
 * @param {*} value
 * 
 * source: https://stackoverflow.com/a/5072145
 */
function filter( things, prop, value ) {
    
    let filteredThings = {};
    
    for( thing in things) {
        
        if( things[thing][prop] != value ) {
            
            filteredThings[thing] = things[thing];
            
        }
        
    }
    
    return filteredThings;
    
}

/**
 * 
 * @param {*} things 
 */
function filterRemoved( things ) {
    
    return filter( things, "status", "-3" );
    
}

/**
 * name, category, tags, dateCreated, dateModified, status
 * default, id, name, category, tags, [ datetimeStart, datetimeStop], status
 */
function sort() {

    // TODO

}

/**
 * 
 * 
 * Document Model
 * 
 */

/**
 * 
 * source : https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
 */
function  removeAllTableRows() {

    let elementClassName = "thing";
    let tableRows = document.getElementsByClassName( elementClassName )[0];

    if( node.length > 0) {
        
        tableRows.remove();

    } else {

        // no rows to remove TODO

    }

}

/**
 * 
 */
function createTableRow( thing ) {
    
    let elementID = "table-header";
    
    let node = document.createElement( "div" );
    node.setAttribute( "class", "thing thing_status_" + thing.status );
    node.setAttribute( "id", "item-" + thing.id );
    node.setAttribute( "tabindex", "-1" );
    let nodePosition = document.getElementById( elementID ).parentElement;
    nodePosition.insertBefore(node, nodePosition[1]);
                
    let tableRow = `
        <div class="data data_field_status">
            <span class="data__label visually-hidden">Priority</span>
            <div class="data__flag ${statusForClassName(thing.status)}">${thing.status}</div>
        </div>
        <div class="data-entry data-entry_field_description">
            <label for="description-${thing.id}">
                <span class="data-entry__label">Description </span>
                <span class="data-entry__error-msg" id="description-${thing.id}-error"></span>
            </label>
            <input
              class="data-entry__input"
              id="description-${thing.id}"
              name="description"
              type="text"
              value="${thing.description}"
              onkeyup="validateDescription(${thing.id});"
              onblur=""
            />
        </div>
        <div class="data data_field_id">
            <span class="data__label visually-hidden">ID Number </span>
            <span>${thing.id}</span>
        </div>
        <div class="data-entry data-entry_field_category">
            <label for="category-${thing.id}">
                <span class="data-entry__label">Category </span>
                <span class="data-entry__error-msg" id="category-${thing.id}-error"></span>
            </label>
            <input
              class="data-entry__input"
              id="category-${thing.id}"
              name="category"
              type="text"
              value="${thing.category}"
              onkeyup="validateCategory(${thing.id});"
              onblur=""
            />
        </div>
        <div class="data-entry data-entry_field_tags">
            <label for="tags-${thing.id}">
                <span class="data-entry__label">Tags </span>
                <span class="data-entry__error-msg" id="tags-${thing.id}-error"></span>
            </label>
            <input
              class="data-entry__input"
              id="tags-${thing.id}"
              name="tags"
              type="text"
              value="${thing.tags}"
              onkeyup="validateTags(${thing.id});"
              onblur=""
            />
        </div>
        <div class="data data_field_date">
            <span class="data_field_date-created">
                <label for="date-created-${thing.id}">
                    <span class="data-entry__label">Date Created </span>
                </label>
                <span class="data_text_date-created" id="date-created-${thing.id}">${thing.dateCreated}</span>
            </span>
            <span class="data_field_date-modified visually-hidden">
                <label for="date-modified-${thing.id}">
                    <span class="data-entry__label">Last Modified </span>
                </label>
                <span class="data_field_date-modified" id="date-modified-${thing.id}">${thing.dateModified}</span>
            </span>
        </div>

        <div class="actions">
            <span class="data-entry data-entry_field_status">
                <label for="status-${thing.id}">
                    <span class="data-entry__label">Status/Priority</span>
                </label>
                <select
                  class="data-entry__input"
                  id="status-${thing.id}"
                  name="status"
                  onChange="updateRememberedThing('${thing.id}',updateStatus);" >
                    
                    <option class="data-entry__input_status_-3" value="-3" disabled ${preSelect( thing.status, -3 )}>
                        Removed
                    </option>
                    <option class="data-entry__input_status_-2" value="-2" disabled ${preSelect( thing.status, -2 )}>
                        Archived
                    </option>
                    <option class="data-entry__input_status_-1" value="-1" ${preSelect( thing.status, -1 )}>
                        Completed
                    </option>
                    <option class="data-entry__input_status_0" value="0" ${preSelect( thing.status, 0 )}>
                        No Priority
                    </option>
                    <option class="data-entry__input_status_1" value="1" ${preSelect( thing.status, 1 )}>
                        1 (low)
                    </option>
                    <option class="data-entry__input_status_2" value="2" ${preSelect( thing.status, 2 )}>
                        2 (low-medium)
                    </option>
                    <option class="data-entry__input_status_3" value="3" ${preSelect( thing.status, 3 )}>
                        3 (medium)
                    </option>
                    <option class="data-entry__input_status_4" value="4" ${preSelect( thing.status, 4 )}>
                        4 (medium-high)
                    </option>
                    <option class="data-entry__input_status_5" value="5" ${preSelect( thing.status, 5 )}>
                        5 (high)
                    </option>
            
                </select>
            </span>
            
            <span class="data-entry data-entry_field_favorite">
                <label for="favorite-${thing.id}">
                    <span class="data-entry__label">Favorite</span>
                    <input
                      class="data-entry__input"
                      id="favorite-${thing.id}"
                      name="favorite"
                      type="checkbox"
                      ${preCheck( thing.favorite )}
                      onChange="updateRememberedThing('${thing.id}',updateFavorite);"
                    />
                    <span class="checkbox"></span>
                </label>
            </span>
            
            <span class="data-entry data-entry_field_delete">
                <input
                  class="data-entry__input btn_delete"
                  id="delete-${thing.id}"
                  type="button"
                  value="Delete"
                  onclick="togglePopup('dialog-box__confirm-delete-${thing.id}');"
                />

                <div id="dialog-box__confirm-delete-${thing.id}" class="dialog-box hidden">
                    <div
                      class="dialog-box__disable-screen"
                      onclick="togglePopup('dialog-box__confirm-delete-${thing.id}');">
                    </div>
                    <div class="dialog-box__dialog">
                        <p>
                            Please confirm.
                        </p>
                        <input
                          class="data-entry__input btn_confirm-delete"
                          id="confirm-delete-${thing.id}"
                          type="button"
                          value="Delete"
                          onclick="updateRememberedThing('${thing.id}',removeRememberedThing);"
                        />
                    </div>
                </div>
            </span>
        </div>
        `;

    document.getElementById( "item-" + thing.id ).innerHTML = tableRow;

}

/**
 * 
 */
function createTableView( things ) {
    
    things = filterRemoved( things );

    for(thing in things) {

        createTableRow( things[thing] );

    }
}

/**
 * 
 */
function removeTableRow( thingID ) {

    let thingElement = document.getElementById( "item-" + thingID );
    thingElement.parentNode.removeChild( thingElement );

}

/**
 * 
 * 
 * UI Feedback
 * 
 */

/**
 * 
 */
function clearDefaultDescription() {

    let elementID = "description";

    if( getInput( elementID ) === "Enter a description-name" ){

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

        errors[0] = "Description/name is required.";

        setErrors( elementID + "-error", errors );

        return setInput( elementID, "Enter a description-name" );

    }

}

function flagToSave() {

}

function statusForClassName( status ) {

    status = "data-entry__input_status_" + status;
  
    return status;

}

/**
 * 
 * 
 * Error Service
 * 
 */

/**
 * 
 * @param {*} elementID 
 */
function clearErrors( elementID ) {

    let element = document.getElementById( elementID );
    element.setAttribute( "aria-hidden", "true" );
    element.innerHTML = "";
    element.parentElement.parentElement.classList.remove( "data-entry_error" );

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

            if( error != undefined ) {
                
                errorMsg = errorMsg + "<li>" + error + "</li>";

            }

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

    let element = document.getElementById( elementID );
    element.setAttribute( "aria-hidden", "false" );
    element.innerHTML = errorList;
    element.parentElement.parentElement.classList.add( "data-entry_error" );

    return errorList;

}

/**
 * 
 * 
 * Input Validators
 * 
 */

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
function validateDescription( thingID=false ) {
    
    let elementID  = "description";
    
    if( thingID !== false ) {
        elementID += "-" + thingID;
    }

    return validateInput( elementID, checkDescriptionRules );

    function checkDescriptionRules( value ) {
        let errors = [];

        if( value === "" || value == "Enter a description-name" ) {
            errors[0] = "Description/name is required."
        }

        if( value.length < 3 ) {
            errors[1] = `The description/name must be between 3 and 256 characters long.`;
        }

        if( value.search( /^[ a-zA-Z0-9!._-]+$/ ) ) {
            errors[2] = `The description/name can only contain alpha-numeric characters, dashes, spaces, and underscores.`;
        }

        return errors;
    }
    

}

/**
 * 
 */
function validateParentID( thingID=false ) {

    let elementID  = "parent-id";
    
    if( thingID !== false ) {
        elementID += "-" + thingID;
    }

    return validateInput( elementID, checkParentIDRules );

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

}

/**
 * 
 */
function validateCategory( thingID=false ) {

    let elementID  = "category";
    
    if( thingID !== false ) {
        elementID += "-" + thingID;
    }

    return validateInput( elementID, checkCategoryRules );

    function checkCategoryRules( value ) {
        let errors = [];
        
        if( value != "" ) {

            if( value.search( /^[ a-zA-Z0-9!._-]+$/ )  ) {
                errors[0] = `The category can only contain alphanumeric characters, dashes, spaces, and underscores.`;
            }
                
        }
        
        return errors;

    }

}

/**
 * 
 */
function validateTags( thingID=false ) {

    let elementID  = "tags";
    
    if( thingID !== false ) {
        elementID += "-" + thingID;
    }
    
    return validateInput( elementID, checkTagsRules );

    function checkTagsRules( value ) {
        let errors = [];
        
        if( value != "" ) {

            if( value.search( /^[ a-zA-Z0-9!._-]+$/ ) ) {
                errors[0] = `The tags can only contain alphanumeric characters, dashes, spaces, and underscores.`;
            }
            
        }
        
        return errors;

    }

}

/**
 * 
 */
function validateStatus( thingID=false ) {

    let elementID  = "status";
    
    if( thingID !== false ) {
        elementID += "-" + thingID;
    }

    return validateInput( elementID, checkStatusRules );

    function checkStatusRules( value ) {
        let errors = [];
        
        if( value == "" ) {
            errors[0] = `Status cannot be blank.`;
        }
        
        return errors;

    }

}

/**
 * 
 */
function validateFavorite( thingID=false ) {

    let elementID  = "status";
    
    if( thingID !== false ) {
        elementID += "-" + thingID;
    }
    
    return validateInput( "favorite", checkFavoriteRules );

    function checkFavoriteRules( value ) {
        errors = [];
        
        if( value === true || value === false ) {
            return true;
        }
    }

}

/**
 * 
 */
function validateForm() {

    if( validateDescription() === true &&
        validateParentID() === true &&
        validateCategory() === true &&
        validateTags() === true &&
        validateStatus() === true &&
        validateFavorite() === true
    ) {
        return true;
    }

    return false;

}

/**
 * 
 * 
 * External
 * 
 */

/**
 * 
 */
function exportRememberRemember() {

    // TODO

}

/**
 * 
 * source: https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
 */
function importRememberRemember() {

    // TODO

}
