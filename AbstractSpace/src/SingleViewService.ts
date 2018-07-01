import {AbstractView} from './AbstractView'
import {remote} from 'electron'

export class SingleViewService {

	updateView: Function
	window

	constructor(view: AbstractView) {
		this.updateView = view.stateUpdateCallback()
		this.window = remote.getCurrentWindow()
	}


	async display(items: Array<any>,
				  replyCallback: Function) {

		this.listenForInput(replyCallback)

		await this.updateView(items)

		if (this.window.hidden)
			this.window.show()
	}


	breakChain() {

		// REPLACE

		///window.removeEventListener('keydown')
		this.window.hide()
	}	

	listenForInput(replyCallback) {
		window.addEventListener('keydown', (ev) => {
			let input = ev.key
			if (input.length===1) {
				replyCallback({
					type: 'key',
					content: input
				})
			}
		})
	}


}
