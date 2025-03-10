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

function waitForAnyElementById(ids, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        function checkElements() {
            for (const id of ids) {
                const element = document.getElementById(id);
                if (element) return resolve(element);
            }
            return null;
        }

        // Check immediately if an element is already present
        const foundElement = checkElements();
        if (foundElement) return;

        // Ensure `document.body` is available before observing
        function waitForBody(callback) {
            if (document.body) {
                callback();
            } else {
                new MutationObserver((_, observer) => {
                    if (document.body) {
                        observer.disconnect();
                        callback();
                    }
                }).observe(document.documentElement, { childList: true });
            }
        }

        waitForBody(() => {
            const observer = new MutationObserver(() => {
                const found = checkElements();
                if (found) {
                    observer.disconnect();
                    resolve(found);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            // Polling fallback in case MutationObserver fails
            const interval = setInterval(() => {
                const found = checkElements();
                if (found) {
                    clearInterval(interval);
                    observer.disconnect();
                    resolve(found);
                } else if (Date.now() - startTime >= timeout) {
                    clearInterval(interval);
                    observer.disconnect();
                    reject(new Error("No element found within timeout"));
                }
            }, 100);
        });
    });
}

function addCompassIcon() {
    // Example usage:
    waitForAnyElementById(["v-headerportlet_WAR_connectrvportlet_INSTANCE_xyz1_LAYOUT_240", "v-headerportlet_WAR_connectrvportlet_INSTANCE_xyz1_LAYOUT_216","v-headerportlet_WAR_connectrvportlet_INSTANCE_xyz1_LAYOUT_315","v-headerportlet_WAR_connectrvportlet_INSTANCE_xyz1_LAYOUT_228","v-headerportlet_WAR_connectrvportlet_INSTANCE_xyz1_LAYOUT_215"]).then(parentElement => {
        waitForElement(() =>
            parentElement
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

    })
    .catch(err => {
        console.error(err);
    });
    
}

addCompassIcon();