let displayInfoBtn = document.getElementById('displayInfoBtn');
let displayArea = document.getElementById('display');
let info;

// displayInfoBtn.addEventListener('click', () => {
//     displayArea.innerHTML = document.body.innerHTML;
// });


// When the button is clicked, inject setPageBackgroundColor into current page
displayInfoBtn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

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
    // console.log(info);

    // Different regex variations for different iframe types
    const re1 = /entryid%2F(\w_\w{8})%2F/;
    const re2 = /entry_id=(\w_\w{8})/;
    const re3 = /\[playlistAPI.kpl0Id\]=(\w_\w{8})/;
    const URIre = /(\w_\w{8})/;
    // [playlistAPI.kpl0Id]=1_b2v9f00x

    // Loop through each iframe
    for (frame of info) {
        // regex match with each iframe's src
        // console.log(frame.src);
        console.log(frame.baseURI);
        let match1 = frame.src.match(re1);
        let match2 = frame.src.match(re2);
        let match3 = frame.src.match(re3);
        let match4 = frame.baseURI.match(URIre);


        // Default value of no match incase no regex match is found for any variation
        let entryid = "not found";
        let domain;
        if (match1) {
            entryid = match1[1];
            domain = 'canvas';
        } else if (match2) {
            entryid = match2[1];
            domain = 'canvas';
        } else if (match3) {
            entryid = match3[1];
            domain = 'canvas';
        } else if (match4) { // matches with the baseURI instead (handle differently for MediaSpace)
            entryid = match4[1];
            domain = 'mediaspace';
        }

        if (domain == 'canvas') {
            // Create the element (with id in it) to add on to the no space div
            let toAppend = document.createElement('div');
            toAppend.classList.add('info');
            toAppend.innerHTML = `Entry/Playlist ID: ${entryid}`;
            console.log(`Entry/Playlist ID: ${entryid}`);

            // Create a no space div to add the info to, which div will be added to the parent of the iframe
            let zeroSpaceDiv = document.createElement('div');
            zeroSpaceDiv.classList.add('no-space');
            zeroSpaceDiv.appendChild(toAppend);

            // Get iframe's parent and apply styling and add no space div as child (right after the iframe..for proper appearance v1.2.0)
            let parent = frame.parentNode;
            parent.classList.add('info-parent');
            parent.insertBefore(zeroSpaceDiv, frame.nextSibling);

            // Fixes an issue with an error box popping out with inline block display
            if (parent.id != "instructure_ajax_error_box") {
                parent.style.display = "inline-block";
            }

            frame.style.margin = "0px";
        } else if (domain == 'mediaspace') {
            // Create the element (with id in it) to add on to the no space div
            let toAppend = document.createElement('div');
            toAppend.classList.add('mediaspace-info');
            toAppend.innerHTML = `Entry/Playlist ID: ${entryid}`;
            console.log(`Entry/Playlist ID: ${entryid}`);

            // Create a no space div to add the info to, which div will be added to the parent of the iframe
            let zeroSpaceDiv = document.createElement('div');
            zeroSpaceDiv.classList.add('mediaspace-no-space');
            zeroSpaceDiv.appendChild(toAppend);

            // Get iframe's parent and apply styling and add no space div as child
            // let parent = frame.parentNode.parentNode.parentNode;
            let parent = document.getElementById('mediaContainer');
            parent.classList.add('mediaspace-info-parent');
            parent.appendChild(zeroSpaceDiv);
            // Fixes an issue with an error box popping out with inline block display
            if (parent.id != "instructure_ajax_error_box") {
                parent.style.display = "inline-block";
            }
        }
    }
}