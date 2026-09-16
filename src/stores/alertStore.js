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

	function create(message, type = "primary") {
		const alertElement = document.getElementById("playerAlert");
		const wrapper = document.createElement("div");
		const formattedMessage = parseMarkdown(message);
		wrapper.innerHTML = [
			`<div class="alert alert-${type} alert-dismissible" role="alert">`,
			`   <div>${formattedMessage}</div>`,
			'   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
			"</div>",
		].join("");

		if (alertElement) {
			alertElement.append(wrapper);

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
				const spinner = document.createElement("div");
				spinner.id = "processSpinner";
				spinner.className = "spinner-border text-primary";
				spinner.setAttribute("role", "status");
				spinner.style.position = "absolute";
				spinner.style.bottom = "20px";
				spinner.style.left = "20px";
				spinner.style.zIndex = "1050";
				spinner.innerHTML =
					'<span class="visually-hidden">Loading...</span>';
				document.body.appendChild(spinner);
			}
		} else {
			if (existingSpinner) {
				existingSpinner.remove();
			}
		}
	}

	return { create, process };
});
