//import * from "React"
import * as React from "react";
import {ipcRenderer, IpcRenderer} from "electron"


export interface ViewCommands {
    update :Function
    reset  :Function
}

export interface ViewItem {
    symbol :string
    name   :string
    nested :boolean
    icon?  :string
}
export interface ViewState {
    title :String
    items :ViewItem[]
}

export class AbstractView extends React.Component {

    state;
    ipc: IpcRenderer

    constructor(props) {
		super(props);
		console.log('instantiating view')
		this.ipc = ipcRenderer
		this.state = {
			items :[]
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
		this.ipc.on('update', (event, state) => {
			console.log('revieved update event')
			console.log(state)
			this.setState({
				items: state
			})
		})
    }

    stateUpdateCallback() :Function {
        return (items :Array<object>) => {
            this.setState({
                selections: items
			})
			console.log(this.state)
        }
    }

    viewCallbacks() :ViewCommands {
        return {
            update: this.stateUpdateCallback(),
            reset: () => super.setState({
                items: []
            })
        }
    }

    render () {
        let rows = this.state.items.map((node) =>
            <tr className="list-row">
                <td className={(node.nested) ? 'nested-list-key' : 'list-key'}>{node.symbol}</td>
                <td className={(node.nested) ? 'nested-list-value' : 'list-value'}>{node.lab}</td>
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
