function waitForElement(getElementFn, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const intervalTime = 100;
      const startTime = Date.now();
  
      const checkExistence = () => {
        try {
          const element = getElementFn();
          if (element) {
            resolve(element);
          } else if (Date.now() - startTime >= timeout) {
            reject(new Error("Element did not load within timeout"));
          } else {
            setTimeout(checkExistence, intervalTime);
          }
        } catch (error) {
          // If there's an error (e.g., intermediate null values), retry
          if (Date.now() - startTime >= timeout) {
            reject(new Error("Element did not load within timeout"));
          } else {
            setTimeout(checkExistence, intervalTime);
          }
        }
      };
  
      checkExistence();
    });
  }
  function insertElementAt(parent, newElement, index) {
    const children = parent.children;
    
    if (index >= children.length) {
      // If index is out of bounds, append at the end
      parent.appendChild(newElement);
    } else {
      // Insert before the child at the given index
      parent.insertBefore(newElement, children[index]);
    }
  }

function createImage(src, alt = "", width = null, height = null) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;

    if (width) img.width = width;
    if (height) img.height = height;

    return img; // Returns the image element
}
function getExtensionImageUrl(imgPath) {
    const runtime = typeof browser !== "undefined" ? browser.runtime : chrome.runtime;
    return runtime.getURL(imgPath);
}

function addCompassIcon() {
    // Example usage:
    waitForElement(() =>
        document.getElementById("v-headerportlet_WAR_connectrvportlet_INSTANCE_xyz1_LAYOUT_240")
            .children[0].children[1].children[0].children[0]
    )
    .then(element => {
        console.log("Element loaded:", element);

        const emailIcon = element.children[7];
        
        let compassIcon = emailIcon.cloneNode(true);

        compassIcon.children[0].href = "https://ellenbrooksc-wa.compass.education/";
        insertElementAt(element, compassIcon, 7);
        compassIcon.children[0].children[0].remove();

        let compassLogo = createImage(getExtensionImageUrl('images/compass.png'), alt="Compass");
        compassLogo.style = "padding: 4px"

        compassIcon.children[0].appendChild(compassLogo);

    })
    .catch(err => {
        console.error(err);
    });
}

addCompassIcon();