const outerLetterInput = document.querySelector("#outer-letter-input")
const centerLetterInput = document.querySelector("#center-letter-input")
const findWordsButton = document.querySelector(".findWords")
const wordContainer = document.querySelector("#word-container")

async function findWords(letters, centerLetter) {
	const words = (await getWords()).split("\n")

	const re = new RegExp(
		`^[${letters + centerLetter}]*${centerLetter}[${letters + centerLetter}]*$`,
		"i"
	)
	return words.filter((word) => {
		return re.test(word) && word.length >= 4
	})
}

async function getWords() {
	return await fetch(
		"https://raw.githubusercontent.com/ConorSheehan1/spelling-bee/main/data/AllWords.txt"
	)
		.then((response) => response.text())
		.then((text) => text.toLowerCase())
}

;[outerLetterInput, centerLetterInput].forEach((input) => {
	input.addEventListener("input", () => {
		if (outerLetterInput.value.length + centerLetterInput.value.length == 7) {
			findWordsButton.disabled = false
		}
	})
})

let globalFoundWords = []

findWordsButton.addEventListener("click", async () => {
	const foundWords = (globalFoundWords = await findWords(
		outerLetterInput.value,
		centerLetterInput.value
	))

	centerLetterInput.disabled = true
	outerLetterInput.disabled = true

	generateListItems(foundWords)
})

function generateListItems(words) {
	document.querySelector("#word-section").classList.remove("d-none")
	wordContainer.innerHTML = ""
	for (const word of words) {
		const li = document.createElement("li")
		li.textContent = word

		wordContainer.appendChild(li)
	}
}

function isPangram(word, letters) {
	return letters.every((letter) => {
		return word.includes(letter)
	})
}

;[...document.querySelector(".dropdown-menu").children].forEach((d_item) => {
	d_item.addEventListener("click", () => {
		const liText = d_item.firstElementChild.textContent

		document.querySelector(".dropdown-toggle").textContent = liText

		switch (d_item.id) {
			case "default-filter":
				generateListItems(globalFoundWords)
				break
			case "pangram-filter":
				generateListItems(
					globalFoundWords.filter((word) =>
						isPangram(word, [
							...outerLetterInput.value,
							...centerLetterInput.value,
						])
					)
				)
				break
			case "size-down-filter":
				generateListItems(
					globalFoundWords.slice().sort((a, b) => b.length - a.length)
				)
				break
			case "size-up-filter":
				generateListItems(
					globalFoundWords.slice().sort((a, b) => a.length - b.length)
				)
				break
		}
	})
})
