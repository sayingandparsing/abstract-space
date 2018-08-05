//import * from "React"
import * as React from "react";
import {ipcRenderer, IpcRenderer} from "electron"
import {Mousetrap} from 'mousetrap'


export interface ViewCommands {
    update :Function
	reset  :Function
}

export class AbstractView extends React.Component {

	state;
	ipc: IpcRenderer
	trap = Mousetrap

    constructor(props) {
		super(props);
		console.log('instantiating view')
		this.ipc = ipcRenderer
        this.state = {
            selections: [{
				symbol: "t",
				label: "test"
			}]
		}

		window.addEventListener('keydown', (ev) => {
			console.log(ev)
			ipcRenderer.send('key', ev.key)
		})
		this.ipc.prependListener('keyup', (ev) => {
			console.log('heard keypress')
			console.log(ev.which)
			this.ipc.emit('key', ev.which)
		})
		this.setState(this.state)
		this.ipc.on('update', (event, items) => {
			console.log('revieved update event')
			this.setState({
				selections: items
			}
		)})
    }

    stateUpdateCallback() :Function {
        return (items :Array<object>) => {
            this.setState({
                selections: items
            })
        }
    }

    viewCallbacks() :ViewCommands {
        return {
            update: this.stateUpdateCallback(),
            reset: () => super.setState({
                selections: []
            })
        }
    }

    render () {
        let rows = this.state.selections.map((node) =>
			<tr className="list-row">
                <td className="list-key">{node.symbol}</td>
                <td className="list-value">{node.lab}</td>
            </tr>
        );

        return (
            <table className="list-table">
				<tbody>
				{rows}
				</tbody>
			</table>
        )
    }
}
