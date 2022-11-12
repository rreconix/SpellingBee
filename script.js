const outerLetterInput = document.querySelector("#outer-letter-input")
const centerLetterInput = document.querySelector("#center-letter-input")
const findWordsButton = document.querySelector(".findWords")
const wordContainer = document.querySelector("#word-container")

async function findWords(letters, centerLetter) {
	const words = (await getWords()).split("\n")

	const re = new RegExp(
		`^(?=.{4,})[${letters + centerLetter}]*${centerLetter}[${
			letters + centerLetter
		}]*$`,
		"i"
	)
	return words.filter((word) => re.test(word))
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
		} else {
			findWordsButton.disabled = true
		}
	})
})

findWordsButton.addEventListener("click", async () => {
	const foundWords = await findWords(
		outerLetterInput.value,
		centerLetterInput.value
	)

	generateListItems(foundWords)
})

function generateListItems(words) {
	document.querySelector(".word-section").classList.remove("d-none")
	wordContainer.innerHTML = ""
	const variousLengths = getVariousLengths(words)

	for (const length of variousLengths) {
		const container = document.createElement("div")

		const wordLengthHeader = document.createElement("div")
		wordLengthHeader.className = "title"
		wordLengthHeader.textContent = `${length} LETTER ANSWERS • ${words.filter(word => word.length == length).length}`

		container.appendChild(wordLengthHeader)

		wordContainer.appendChild(container)
	}

	for (const word of words.sort()) {
		const a = document.createElement("a")
		a.className =
			"word" +
			(isPangram(word, [
				...outerLetterInput.value,
				centerLetterInput.value,
				...outerLetterInput.value,
				centerLetterInput.value,
			])
				? " pangram"
				: "")
		a.textContent = word
		a.href = `https://www.dictionary.com/browse/${word}`
		a.target = "_blank"

		const index = variousLengths.indexOf(word.length)
		const container = [...wordContainer.children][index]
		container.appendChild(a)
	}
}

function getVariousLengths(words) {
	return [...new Set(words.map((word) => word.length)).keys()].sort()
}

function isPangram(word, letters) {
	return letters.every((letter) => {
		return word.includes(letter.toLowerCase())
	})
}
