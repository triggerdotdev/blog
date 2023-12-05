// Get all elements between two elements for example, between h1 and h2
export function getElementsBetween(startElement: Element, endElement: Element) {
    let currentElement = startElement;
    const elements = [];

    // Traverse the DOM until the endElement is reached
    while (currentElement && currentElement !== endElement) {
        currentElement = currentElement.nextElementSibling!;

        // If there's no next sibling, go up a level and continue
        if (!currentElement) {
            // @ts-ignore
            currentElement = startElement.parentNode!;
            startElement = currentElement;
            if (currentElement === endElement) break;
            continue;
        }

        // Add the current element to the list
        if (currentElement && currentElement !== endElement) {
            elements.push(currentElement);
        }
    }

    return elements;
}