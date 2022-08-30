// popup.js


const analyze = document.getElementById("analyze");

analyze.addEventListener("click", async () => {
    // Sending message to background
    chrome.runtime.sendMessage({ name: 'sendpopup' }, function (response) {
        console.log('Response received:', response);
    });

    // Sending message to content
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { name: "sendpopup" }, function (response) {
            if (response != null) {
                const display = document.getElementById('display');
                const images = response.map(image => {
                    let name = image.currentSrc.split('/');
                    name = name[name.length - 1];
                    const height = image.height;
                    const width = image.with;
                    allImagesList.push(image.currentSrc);
                    return `<li><a href=${image.currentSrc} target="_blank">${name} (${height} x ${width})}</a></li>`
                });
                const listImages = `<ul>${images.join('')}</ul>`;
                const ele = document.createElement("span");
                ele.innerHTML = listImages;
                display.appendChild(ele);
                const allImagesButton = document.createElement('button');
                allImagesButton.innerText = 'All images';
                allImagesButton.onclick = showAllImages;
                display.appendChild(allImagesButton);
            }
        });
    });

});


// Avoid popup closing after clicking anchor
document.addEventListener('click', event => {
    const a = event.target.closest('a[href]');
    if (a) {
        event.preventDefault();
        chrome.tabs.create({ url: a.href, active: false });
    }
});


// Images


const allImagesList = [];

function showAllImages() {
    if (confirm(`Are you sure you want to open ${allImagesList.length} new tabs?`)){
    for(let image of allImagesList){
        chrome.tabs.create({ url: image });
    }
}
}