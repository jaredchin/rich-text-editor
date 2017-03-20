const equationEditor = document.querySelector('.equationEditor');
const latexEditor = document.querySelector('.latexEditor');
const resultNode = document.querySelector('.result')
const MQ = MathQuill.getInterface(2); // for backcompat

const mathButtons = initToolbar()

$(resultNode).click(e => {
	$('.math').addClass('focus')
	mathField.reflow()
	mathButtons.each((i, m) => m.reflow())
	mathField.focus()
})

let focus1 = false
let focus2 = false
function updateVisibility() {
	setTimeout(() => {
		$('.math').toggleClass('focus', focus1 || focus2)
		updateResult()
	}, 100)

}
$(equationEditor)
	.on('focusin focusout', e => {
		focus1 = e.type === 'focusin'
		updateVisibility()
	})
$(latexEditor).on('focus blur', e => {
	focus2 = e.type === 'focus'
	updateVisibility()
})

const mathField = MQ.MathField(equationEditor, {
	spaceBehavesLikeTab: true, // configurable
	handlers:            {
		edit: (e) => { // useful event handlers
			latexEditor.value = mathField.latex(); // simple API
		}
	}
});
latexEditor.addEventListener('keyup', () => {
	setTimeout(() => mathField.latex(latexEditor.value), 0)
})
mathField.latex(latexEditor.value)

$('.answer').get(0).focus()

let result = null
MathJax.Hub.Queue(() => result = MathJax.Hub.getAllJax(resultNode)[0])

function updateResult() {
	MathJax.Hub.Queue(() => result.Text(latexEditor.value))
}
updateResult()

function initToolbar() {
	const actions = [
		{action: '\\sqrt', label: '\\sqrt{\\square}'},
		{action: '^', label: '\\square^{\\square}'},
		{action: '\\frac', label: '\\frac{\\square}{\\square}'},
		{action: '\\int', label: '\\int_{\\square}^{\\square}'},
		{action: '\\neq', label: '\\neq'},
		{action: '\\lim_', label: '\\lim_{\\square}'},
		{action: '\\to', label: '\\to'},
		{action: '\\overrightarrow', label: '\\overrightarrow{\\square}'}
	]

	$('.mathToolbar').append(actions.map(o => $(`<button id="${o.action}">${o.label}</button>`)))
	const buttons = $('.mathToolbar button')
	buttons.click(e => {
		mathField.focus()
		const symbol = e.currentTarget.id
		mathField.typedText(symbol)
		if(symbol.startsWith('\\')) mathField.keystroke('Tab')
	})
	return buttons.map((i, elem) => MQ.StaticMath(elem))
}
const chars = [
	'°', '≡',
	'⌐', '×', '«', '»', '…', '∫', '¬', '√', 'ƒ', '≈', '‹', '›', '∙', '‰', '¹', '²', '³', '½', '¼', '¾', '←', '↑', '→', '↓', '↔', '↕', '↨', '≠', 'Ø', '∞', '±', '≤', '≥', 'µ', '∂', '∑', '∏', 'Ω', '∆', 'ı', 'Ð',
	'ð', 'Þ', 'þ', 'Γ', 'Θ', 'Φ', 'α', 'δ', 'ε', 'σ', 'τ', 'φ', '∩', 'Ω', 'ω', 'Д', 'Ф'
]

const $characters = $('.toolbar .characters')

$characters.find('.list').append(chars.map(char => $(`<span class="button">${char}</span>`)))
$('.toolbar .button').mousedown(e => {
	pasteHtmlAtCaret(e.currentTarget.innerText)
	e.preventDefault()
	return false
})
$characters.find('.toggle').mousedown(e => {
	$characters.find('.list').toggle()
	e.preventDefault()
	return false
})

function pasteHtmlAtCaret(html) {
	let sel;
	let range;
	if (window.getSelection) {
		sel = window.getSelection();
		if (sel.getRangeAt && sel.rangeCount) {
			range = sel.getRangeAt(0);
			range.deleteContents();
			const el = document.createElement("div");
			el.innerHTML = html;
			let frag = document.createDocumentFragment(), node, lastNode;
			while ( (node = el.firstChild) ) {
				lastNode = frag.appendChild(node);
			}
			range.insertNode(frag);
			if (lastNode) {
				range = range.cloneRange();
				range.setStartAfter(lastNode);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);
			}
		}
	}
}