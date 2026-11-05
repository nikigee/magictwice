import { defineStore } from "pinia";

export const useAlertStore = defineStore("alert", () => {
	function parseMarkdown(text) {
		if (!text || typeof text !== "string") return text;

		return text
			.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
			.replace(/__(.*?)__/g, "<strong>$1</strong>")
			.replace(/\*(.*?)\*/g, "<em>$1</em>")
			.replace(/_(.*?)_/g, "<em>$1</em>")
			.replace(/`(.*?)`/g, "<code>$1</code>")
			.replace(/~~(.*?)~~/g, "<del>$1</del>");
	}

	function typewriteElement(targetEl, htmlContent, alertBox) {
		const temp = document.createElement("div");
		temp.innerHTML = `"${htmlContent}"`;

		const textEntries = [];
		function collectTextNodes(node) {
			if (node.nodeType === Node.TEXT_NODE) {
				textEntries.push({
					node,
					fullText: node.nodeValue || "",
				});
				node.nodeValue = "";
			} else {
				node.childNodes.forEach(collectTextNodes);
			}
		}
		collectTextNodes(temp);

		while (temp.firstChild) {
			targetEl.appendChild(temp.firstChild);
		}

		const cursor = document.createElement("span");
		cursor.className = "vn-cursor";
		cursor.textContent = "▍";
		targetEl.appendChild(cursor);

		alertBox.classList.add("is-speaking");

		let entryIdx = 0;
		let charIdx = 0;
		let timerId = null;
		let finished = false;

		function finishImmediately() {
			if (finished) return;
			finished = true;
			if (timerId) clearTimeout(timerId);

			for (const entry of textEntries) {
				entry.node.nodeValue = entry.fullText;
			}
			alertBox.classList.remove("is-speaking");
			cursor.textContent = "▾";
		}

		function step() {
			if (finished) return;

			while (
				entryIdx < textEntries.length &&
				charIdx >= textEntries[entryIdx].fullText.length
			) {
				entryIdx++;
				charIdx = 0;
			}

			if (entryIdx >= textEntries.length) {
				finishImmediately();
				return;
			}

			const current = textEntries[entryIdx];
			const nextChar = current.fullText[charIdx];
			current.node.nodeValue += nextChar;
			charIdx++;

			// Slight cadence pause on punctuation like a visual novel
			let delay = 20;
			if ([".", "!", "?"].includes(nextChar)) {
				delay = 140;
			} else if ([",", ";", ":"].includes(nextChar)) {
				delay = 70;
			}

			timerId = setTimeout(step, delay);
		}

		// Allow clicking the dialogue area to skip typing animation
		alertBox.addEventListener("click", (e) => {
			if (!e.target.classList.contains("btn-close")) {
				finishImmediately();
			}
		});

		step();
	}

	function create(message, type = "primary") {
		const alertElement = document.getElementById("playerAlert");
		const wrapper = document.createElement("div");
		const formattedMessage = parseMarkdown(message);
		wrapper.innerHTML = [
			`<div class="alert alert-${type} alert-dismissible mascot-alert d-flex align-items-stretch p-0 overflow-hidden shadow-sm" role="alert">`,
			'   <div class="alert-mascot-wrap flex-shrink-0">',
			'       <div class="alert-mascot"></div>',
			"   </div>",
			'   <div class="alert-dialogue flex-grow-1 d-flex align-items-center py-3 ps-3 pe-5" title="Click to skip typing">',
			'       <div class="alert-dialogue-text"></div>',
			"   </div>",
			'   <button type="button" class="btn-close top-0 end-0 m-2 p-2" data-bs-dismiss="alert" aria-label="Close"></button>',
			"</div>",
		].join("");

		if (alertElement) {
			alertElement.append(wrapper);

			const alertBox = wrapper.querySelector(".mascot-alert");
			const textTarget = wrapper.querySelector(".alert-dialogue-text");
			if (alertBox && textTarget) {
				typewriteElement(textTarget, formattedMessage, alertBox);
			}

			// Set tabindex and focus wrapper for accessibility, removing outline to prevent visual distraction
			wrapper.setAttribute("tabindex", "-1");
			wrapper.style.outline = "none";
			wrapper.focus({ preventScroll: true });

			// Scroll the wrapper into view smoothly
			wrapper.scrollIntoView({ behavior: "smooth", block: "nearest" });
		}
	}

	function process(show = true) {
		const existingSpinner = document.getElementById("processSpinner");

		if (show) {
			if (!existingSpinner) {
				const wrapper = document.createElement("div");
				wrapper.id = "processSpinner";
				wrapper.className =
					"d-flex align-items-center justify-content-center p-3 rounded-4 shadow-lg";
				wrapper.style.position = "fixed";
				wrapper.style.top = "50%";
				wrapper.style.left = "50%";
				wrapper.style.transform = "translate(-50%, -50%)";
				wrapper.style.backgroundColor = "rgba(9, 12, 17, 0.85)";
				wrapper.style.backdropFilter = "blur(4px)";
				wrapper.style.border = "1px solid rgba(255, 255, 255, 0.1)";
				wrapper.style.pointerEvents = "none";
				wrapper.style.zIndex = "1050";
				wrapper.innerHTML =
					'<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
				document.body.appendChild(wrapper);
			}
		} else {
			if (existingSpinner) {
				existingSpinner.remove();
			}
		}
	}

	return { create, process };
});
