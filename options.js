const extendCharsLimitCheckbox = document.querySelector("#extendCharsLimit");
const preventAccidentalScrollingCheckbox = document.querySelector("#preventAccidentalScrolling");

chrome.storage.sync.get(["extendCharsLimit", "preventAccidentalScrolling"], (result) => {
	if (result.extendCharsLimit !== undefined) {
		extendCharsLimitCheckbox.checked = result.extendCharsLimit;
	}
	if (result.preventAccidentalScrolling !== undefined) {
		preventAccidentalScrollingCheckbox.checked = result.preventAccidentalScrolling;
	}
});

extendCharsLimitCheckbox.addEventListener("change", () => {
	chrome.storage.sync.set({ extendCharsLimit: extendCharsLimitCheckbox.checked });
});

preventAccidentalScrollingCheckbox.addEventListener("change", () => {
	chrome.storage.sync.set({ preventAccidentalScrolling: preventAccidentalScrollingCheckbox.checked });
});
