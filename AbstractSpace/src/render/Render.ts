import {AbstractView} from './AbstractView'
import * as React from "react"
import {render} from "react-dom"


class Render {

	main = document.getElementById("main")
	a = document.createElement("p")

	view = render(
		React.createElement(AbstractView, null),
		this.main
	)

	constructor() {
	}

}

const r = new Render()
