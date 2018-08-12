import {AbstractView} from './AbstractView'
import * as React from "react"
import * as dom from "react-dom"
import { ViewController } from '../ViewController';


class Render {

	main = document.getElementById("main")
	a = document.createElement("p")

	view :AbstractView = dom.render(
		React.createElement(AbstractView, null),
		this.main
	)

	constructor() {
	}

}

const r = new Render()
