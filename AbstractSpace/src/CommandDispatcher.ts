

import {Command, ProcessResultMessage, ProcessState} from "./DataTypes"


import {remote} from 'electron'
import {MapLike} from "typescript"
//import * as child_process from "child-process"

export class CommandDispatcher {

    //commandRegistry: MapLike<String,Command>


    constructor() {

    }

    notifyProcessState(msg: ProcessResultMessage) {
        console.log("notified of process result")
        console.log(msg)
        switch (msg.event) {
            case ProcessState.TERMINATED:
                this.closeWindow()
                break
            case ProcessState.COMPLETED:
                this.closeWindow()
                this.executeCommand(msg.command)
                break

        }
    }

    closeWindow() {
        remote.getCurrentWindow().hide()
    }


    executeCommand(commandId) {
        switch (commandId.type) {
            case "KEYS":
                console.log('simulating keys')
                console.log(`"from pywinauto.keyboard import SendKeys; SendKeys('${commandId.arg}')"`)
/*                let x = child_process.spawn('python.exe',
                    ['C:\\Users\\rmacc\\as_scripts\\simulate_key.py', commandId.arg],
                    //['-c', `"from pywinauto.keyboard import SendKeys; SendKeys('${commandId.arg}')"`],
                    {
                        detached: true,
                        stdio: 'ignore'
                    })*/
/*				x.on('exit', function (code, signal) {
                    console.log('child process exited with ' +
                        `code ${code} and signal ${signal}`);
                });
                x.stdout.on('data', (data) => {
                    console.log(`child stdout:\n${data}`);
                });

                x.stderr.on('data', (data) => {
                    console.error(`child stderr:\n${data}`);
                });*/

            //'python.exe C:\\Users\\rmacc\\as_scripts\\simulate_key.py "' + commandId.arg + '"')
        }
    }
}
