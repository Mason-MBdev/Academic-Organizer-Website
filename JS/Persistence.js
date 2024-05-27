// Function to save the coursemanager object
function saveToFile(coursemanager) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(coursemanager));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "course-data.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
