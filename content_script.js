(function () {
	"use strict";

	async function waitForElement(root, selector) {
		return new Promise((resolve, reject) => {
			if (root.querySelector(selector)) {
				resolve(root.querySelector(selector));
			} else {
				const observer = new MutationObserver((mutations) => {
					mutations.forEach((mutation) => {
						if (mutation.type === "childList") {
							if (root.querySelector(selector)) {
								resolve(root.querySelector(selector));
								observer.disconnect();
								clearTimeout(timeout);
							}
						}
					});
				});
				observer.observe(root, { childList: true, subtree: true });
				const timeout = setTimeout(() => {
					observer.disconnect();
					reject(new Error("Timeout"));
				}, 10000);
			}
		});
	}

	async function extendCharsLimit() {
        chrome.storage.sync.get(["extendCharsLimit"], async (result) => {
            if (result.extendCharsLimit) {
                const serp = await waitForElement(
                    document,
                    "cib-serp[serp-slot='none']"
                );
                const serpShadowRoot = serp.shadowRoot;
                const actionBar = await waitForElement(
                    serpShadowRoot,
                    "cib-action-bar"
                );
                const actionBarShadowRoot = actionBar.shadowRoot;
                const serpTextInput = await waitForElement(
                    actionBarShadowRoot,
                    "cib-text-input[serp-slot='none']"
                );
                const serpTextInputShadowRoot = serpTextInput.shadowRoot;
                const textarea = await waitForElement(
                    serpTextInputShadowRoot,
                    "textarea[maxlength]"
                );
                textarea.setAttribute("maxlength", "20000");
                const letterCounter = await waitForElement(
                    actionBarShadowRoot,
                    ".letter-counter"
                );
                letterCounter.childNodes[
                    letterCounter.childNodes.length - 1
                ].textContent = "/20,000";
            }
        });
    }

    window.addEventListener("load", extendCharsLimit);
    window.addEventListener("popstate", extendCharsLimit);

    chrome.storage.sync.get(["preventAccidentalScrolling"], (result) => {
        if (result.preventAccidentalScrolling) {
            window.addEventListener("wheel", e=>{
                if(e.target.className.includes("cib-serp-main")) e.stopPropagation();
            });
        }
    });
})();
