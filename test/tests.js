describe('math editor', () => {
    const $answer1 = $('.answer1')
    const pasteEventMock = {
        type: 'paste', originalEvent: {
            clipboardData: {
                getData: () => {
                }
            }
        }
    }

    before('wait for tools to hide', waitUntil(() => $('[data-js="tools"]').length > 0 && $('[data-js="tools"]').position().top < 0))

    describe('init', () => {
        it('answer field is contenteditable', () => {
            const $answer = $('[data-js="answer"]')
            expect($answer).to.have.attr('contenteditable', 'true')
        })
    })

    describe('focus rich text', () => {
        before(() => $answer1.focus())
        before('wait for tools visible', waitUntil(() => $('[data-js="tools"]').is(':visible')))

        it('shows tools', () => expect($('[data-js="charactersList"]')).to.be.visible)
        it('hide math tools', () => expect($('[data-js="mathToolbar"]')).to.be.hidden)

        describe('pasting images', () => {
            describe('png', () => {
                before(done => {
                    $answer1
                        .append('<img src="data:image/png;base64,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9Yg2woFILdQVwNbW0vxHpCdYW81okRoQa1IyOfkO8YY4IwC+9U5OTjRMTn6rRIZ9hPiYDzPefNrHCBB7fgTAaswulR3t4F/iL7PJBaNykWRYAAAACXBIWXMAABYlAAAWJQFJUiTwAAADFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj4xNDQ8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjE8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj4xNDQ8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj40PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjQ8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KWgUIKQAAABZJREFUCB1jVFJS+s+ABJiQ2GAmYQEAW2ABbbiXJhsAAAAASUVORK5CYII=" alt="">')
                    $answer1.find('img:last').get(0).onload = e => {
                        if (e.target.src.startsWith('http')) done()
                    }
                    $answer1.trigger(pasteEventMock)
                })
                it('saves pasted image', () => {
                    expect($answer1.find('img:last')).to.have.attr('src').match(/\/screenshot/)
                })
            })
            describe('not png', () => {
                let currentImgAmout
                before(done => {
                    currentImgAmout = $answer1.find('img').length
                    $answer1
                        .append('<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=">')
                    $('.answer1 img:last').get(0).onload = e => {
                        done()
                    }
                    $answer1.trigger(pasteEventMock)
                })
                it('ignores other than png images', () => {
                    expect($answer1.find('img').length).to.equal(currentImgAmout)
                })
            })
        })

        describe('start math', () => {
            before(() => $answer1.focus())
            before('wait for tools visible', waitUntil(() => $('[data-js="tools"]').is(':visible')))
            before(() => $('[data-js="newEquation"]').mousedown())

            it('shows math tools', () => expect($('[data-js="mathToolbar"]')).to.be.visible)
            it('shows math editor', () => expect($('[data-js="mathEditor"]')).to.be.visible)

            describe('keeps both fiels in sync', () => {
                before(() => $('[data-js="latexField"]').focus().val('x+y').keyup())
                before(() => $answer1.focus())
                before(done => setTimeout(done, 0))

                it('shows math in latex field', () => {
                    expect($('[data-js="equationField"]')).to.have.text('x+y')
                })
                it('shows math in img', () => expect($('img:first')).to.have.attr('src', '/math.svg?latex=x%2By'))
            })
        })
    })
})

function waitUntil(condition) {
    return done => _waitUntil(condition, done)
}

function _waitUntil(condition, done) {
    if (condition()) done()
    else setTimeout(() => _waitUntil(condition, done), 200)
}
