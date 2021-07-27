let displayInfoBtn = document.getElementById('displayInfoBtn');
let displayArea = document.getElementById('display');
let info;

// displayInfoBtn.addEventListener('click', () => {
//     displayArea.innerHTML = document.body.innerHTML;
// });


// When the button is clicked, inject setPageBackgroundColor into current page
displayInfoBtn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    await chrome.scripting.executeScript({
        target: {
            tabId: tab.id
        },
        function: getInfo,
    });
});

// The body of this function will be executed as a content script inside the
// current page
function getInfo() {
    info = document.getElementsByTagName('iframe');
    console.log(info);
    for (frame of info) {
        let toAppend = document.createElement('p');
        toAppend.style.color = "darkred";
        toAppend.style.fontSize = "24pt";
        toAppend.innerHTML = "Entry Id Here";
        frame.parentNode.appendChild(toAppend);
        console.log(frame.outerHTML);
    }
}
