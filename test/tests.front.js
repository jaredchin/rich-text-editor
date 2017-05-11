const u = require('./testUtil')
const base64png = require('./base64png')
window.locale = 'FI'
window.IS_TEST = true
mocha.setup({
    ui: 'bdd',
//    reporter: WebConsole
})
window.expect = chai.expect

const $el = {}

describe('rich text editor', () => {
    before('wait for tools to hide', u.waitUntil(() => u.isOutsideViewPort($('[data-js="tools"]'))))
    before('wait answer field to initialize', u.waitUntil(() => $('.answer1').attr('contenteditable')))
    before(() => {
        $el.answer1 = $('.answer1')
        $el.latexField = $('[data-js="latexField"]')
        $el.equationField = $('[data-js="equationField"]')
        $el.equationFieldTextArea = $el.equationField.find('textarea')
        $el.mathToolbar = $('[data-js="mathToolbar"]')
        $el.tools = $('[data-js="tools"]')
        $el.mathEditor = $('[data-js="mathEditor"]')
    })
    before('focus', () => $el.answer1.focus())
    before('wait for tools visible', u.waitUntil(() => $el.tools.is(':visible')))

    it('shows character list', () => expect($('[data-js="charactersList"]')).to.be.visible)
    it('hide math tools', () => expect($el.mathToolbar).to.be.hidden)

    describe('when pasting images', () => {
        describe('png', () => {
            before('paste image', done => {
                $el.answer1.append(base64png)
                $el.answer1.find('img:last').get(0).onload = e => {
                    if (~e.target.src.indexOf('http')) done()
                }
                $el.answer1.trigger(u.pasteEventMock)
            })
            it('saves pasted image', () => {
                expect($el.answer1.find('img:last')).to.have.attr('src').match(/\/screenshot/)
            })
        })
        describe('not png', () => {
            let currentImgAmout
            before('#3', done => {
                currentImgAmout = $el.answer1.find('img').length
                $el.answer1
                    .append('<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=">')
                $('.answer1 img:last').get(0).onload = e => {
                    done()
                }
                $el.answer1.trigger(u.pasteEventMock)
            })
            it('ignores other than png images', () => {
                expect($el.answer1.find('img').length).to.equal(currentImgAmout)
            })
        })
    })

    describe('start math', () => {
        before('wait for tools visible', u.waitUntil(() => $el.tools.is(':visible')))
        before(() => $('[data-js="newEquation"]').mousedown())

        it('shows math tools', () => expect($el.mathToolbar).to.be.visible)
        it('shows math editor', () => expect($el.mathEditor).to.be.visible)

        describe('when focus in latex field', () => {
            before('type', () => $el.latexField.focus().val('xy').trigger('input'))
            before(u.delay)
            before(() => $('.rich-text-editor-toolbar-characters-group button:eq(2)').mousedown())
            before(u.delay)
            before('focus', () => $el.answer1.focus())

            it('shows math in equation field', () => expect($el.equationField).to.have.text('xy±'))
            it('shows math in latex field', () => expect($el.latexField).to.have.value('xy\\pm'))
            it('shows math in img', () => expect($('img:first')).to.have.attr('src', '/math.svg?latex=xy%5Cpm'))
        })

        describe('when focus in equation field', () => {
            before(() => $('img:first').trigger({type: 'click', which: 1}))
            before(() => $el.latexField.trigger('blur').val('').trigger('input'))
            before(() => $el.equationFieldTextArea.trigger('focusin').val('a+b').trigger('paste'))
            before(u.delay)
            before(() => $('.rich-text-editor-toolbar-characters-group button:eq(3)').mousedown())
            before(u.delay)
            before(() => $el.answer1.focus())

            it('shows math in equation field', () => expect($el.equationField).to.have.text('a+b∞'))
            it('shows math in latex field', () => expect($el.latexField).to.have.value('a+b\\infty'))
            it('shows math in img', () => expect($('img:first')).to.have.attr('src', '/math.svg?latex=a%2Bb%5Cinfty'))
        })

        describe('equation click opens and esc closes math editor', () => {
            before(() => $('img:first').trigger({type: 'click', which: 1}))
            it('editor is visible and then hidden', () => {
                expect($el.mathEditor).to.be.visible
                $el.answer1.trigger({type: 'keydown', keyCode: 27})
                expect($el.mathEditor).to.be.hidden
            })
        })

        describe('when clicking special character from toolbar', () => {
            before(() => $('.rich-text-editor-toolbar-characters-group button:first').mousedown())

            it('inserts special character to answer body', () => {
                expect($el.answer1).to.have.text('°')
            })
        })
    })
})