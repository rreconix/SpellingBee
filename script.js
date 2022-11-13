const outerLetterInput = document.querySelector("#outer-letter-input")
const centerLetterInput = document.querySelector("#center-letter-input")
const findWordsButton = document.querySelector(".findWords")
const sectionContainer = document.querySelector(".section-container")

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

Array.prototype.isEqual = function (array) {
	return (
		JSON.stringify(this) === JSON.stringify(array) &&
		Array.isArray(this) &&
		Array.isArray(array)
	)
}

let letters = []

;[outerLetterInput, centerLetterInput].forEach((input) => {
	input.addEventListener("input", () => {
		if (
			outerLetterInput.value.length + centerLetterInput.value.length == 7 &&
			!letters.isEqual(getLetters())
		) {
			findWordsButton.disabled = false
		} else {
			findWordsButton.disabled = true
		}
	})
})

function getLetters() {
	return [...outerLetterInput.value, centerLetterInput.value]
}

findWordsButton.addEventListener("click", async () => {
	letters = getLetters()
	findWordsButton.disabled = true
	const foundWords = await findWords(
		outerLetterInput.value,
		centerLetterInput.value
	)

	generateListItems(foundWords)
})

function generateListItems(words) {
	document.querySelector(".answer-section").classList.remove("d-none")
	sectionContainer.innerHTML = ""

	const wordsWithoutPangram = words.filter((word) => !isPangram(word))
	const pangrams = words.filter((word) => isPangram(word))

	const variousLengths = getVariousLengths(wordsWithoutPangram)
	const formattedWords = new Map()
	formattedWords.set(("Pangram" + (pangrams.length == 1 ? "" : "s")), pangrams)

	for (const length of variousLengths) {
		if (formattedWords.get(length) == undefined) {
			formattedWords.set(
				`${length}-Letter Words`,
				wordsWithoutPangram.filter((word) => word.length == length)
			)
		}
	}

	createElements(formattedWords)
}

function createElements(wordsMap) {
	for (const [key, value] of wordsMap.entries()) {
		// section
		const section = document.createElement("div")
		section.className = "section"

		// header
		const header = document.createElement("header")

		// header children
		const title = document.createElement("h3")
		title.textContent = `${key}`

		const foundWords = document.createElement("span")
		foundWords.textContent = `${value.length} Words`

		header.appendChild(title)
		header.appendChild(foundWords)

		// words
		const wordContainer = document.createElement("div")
		for (const word of value) {
			const wordElement = document.createElement("a")
			wordElement.href = `https://www.dictionary.com/browse/${word}`
			wordElement.target = "_blank"
			wordElement.className = "word"
			wordElement.textContent = word

			wordContainer.appendChild(wordElement)
		}

		section.appendChild(header)
		section.appendChild(wordContainer)

		sectionContainer.appendChild(section)
	}
}

function getVariousLengths(words) {
	return [...new Set(words.map((word) => word.length)).keys()].sort()
}

function isPangram(word) {
	return letters.every((letter) => {
		return word.includes(letter.toLowerCase())
	})
}
