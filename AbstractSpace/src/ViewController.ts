/**
 * Created by rmacc on 6/7/2017.
 */

import {BrowserWindow} from 'electron'
import {ProcessState} from './types/DataTypes'


export class ViewController {

    window
    tableDiv
    table

    constructor(window)
    {
        this.window = window
    }


    message(msg)
    {
        if (msg.signal) {
            this.processSignal(msg.signal)
        } else {
            this.updateView(msg)
        }
    }


    processSignal(signal: ProcessState)
    {
        switch (signal) {
            case ProcessState.TERMINATED:
                //this.hideView(); break
        }
    }


    updateView(msg: object)
    {
        let table = document.createElement('table')
        for (var item of Object.keys(msg)) {
            let row = table.insertRow()
            let cell1 = row.insertCell(0)
            cell1.innerHTML = item.toString()
            let cell2 = row.insertCell(1)
            cell2.innerHTML = msg[item]
            this.tableDiv.remove(this.table)
            this.table = table
            this.tableDiv.appendElement(this.table)
        }
    }


   /* hideView() {
        window.hide()
    }*/

}
