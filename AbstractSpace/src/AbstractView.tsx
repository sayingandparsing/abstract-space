//import * from "React"
import * as React from "react";


export interface ViewCommands {
    update :Function
    reset  :Function
}

export class AbstractView extends React.Component {

    state;

    constructor(props) {
        super(props);
        this.state = {
            selections: []
        }
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
    	console.log('rendering')
        let rows = this.state.selections.map((node) =>
			<tr className="list-row">
                <td className="list-key">{node.symbol}</td>
                <td className="list-value">{node.label}</td>
            </tr>
        );
        console.log(rows)

        return (
            <table className="list-table">
				<tbody>
				{rows}
				</tbody>
			</table>
        )
    }
}
