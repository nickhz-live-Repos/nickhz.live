/**
 * Made by Nick Hernandez, January 2nd, 2025
 * 
 * Allows an HTML selector element to select which elements should be 
 * visible within a specified parent element. Run this function with a 
 * selector's onchange event, the ID attribute of the element containing 
 * items to filter, and an optional parameter to define a default CSS display 
 * style for items that aren't filtered from display.
 * 
 * Filtered items will be set to "display: none," and unfiltered items 
 * will have their display properties either removed or made to match the 
 * defaultDisplay input if that input is present.
 * 
 * HTML tags directly under the filterable-items parent must have data-* 
 * attributes set that match the values of the HTML selector options. For 
 * instance, if a selector option has the value "foo," then all HTML elements 
 * except those containing "data-foo" attributes will be filtered from 
 * appearing whenever the "foo" option is selected.
 * 
 * Additionally, if the selector has options with values "all" or "none," then 
 * these options will respectively display or hide all filterable elements.
 * 
 * @param {Event} selectorChangeEvent 
 * @param {String} filteredElementsParentId 
 * @optional @param {String} defaultDisplay
 * @returns UI visual filtering
 */
const filterBySelector = (selectorChangeEvent, filteredElementsParentId, defaultDisplay) => {
    const selection = selectorChangeEvent.target.value;
    const filteredElements = document.getElementById(filteredElementsParentId).children;

    // defines dynamic display setting based on whether there's a defaultDisplay input
    const resetDisplay = 
        defaultDisplay === undefined || typeof defaultDisplay != 'string'
            ? (element) => { element.style.removeProperty('display'); }
            : (element) => { element.style.display = defaultDisplay; }
    ;

    if(selection === 'all') {
        for(const element of filteredElements) {
            resetDisplay(element);
        }
    } else if(selection === 'none') {
        for(const element of filteredElements) {
            element.style.display = 'none';
        }
    } else {
        for(const element of filteredElements) {
            if(typeof element.dataset[selection] === 'string') {
                resetDisplay(element);
            } else {
                element.style.display = 'none';
            }
        }
    }
};
