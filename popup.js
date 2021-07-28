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
    // Get all iframes and put in info variable
    info = document.getElementsByTagName('iframe');
    console.log(info);
    
    // Different regex variations for different iframe types
    const re1 = /entryid%2F(\w_\w{8})%2F/;
    const re2 = /entry_id=(\w_\w{8})/;
    
    // Loop through each iframe
    for (frame of info) {
        // regex match with each iframe's src
        console.log(frame.src);
        let match1 = frame.src.match(re1);
        let match2 = frame.src.match(re2);

        // Default value of no match incase no regex match is found for any variation
        let entryid = "no match";
        if (match1) {
            entryid = match1[1];
        } else if (match2)  {
            entryid = match2[1];
        }
        

        let toAppend = document.createElement('p');
        toAppend.style.color = "darkred";
        toAppend.style.fontSize = "24pt";
        toAppend.innerHTML = entryid;
        frame.parentNode.appendChild(toAppend);
        // https://cdnapisec.kaltura.com/p/1530551/embedPlaykitJs/uiconf_id/48353853?iframeembed=true&entry_id=1_t1thliam
    }
}
