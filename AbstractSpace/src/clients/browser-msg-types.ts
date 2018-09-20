
//export namespace Msg {


    export enum Modifier {
        CTRL,
        ALT,
        SHIFT,
        ALTGR,
        META,
        SUPER,
        HYPER
    }

    export interface Command {
        id   :number
        exch :string
        name :string
        args :any[]
    }

    export interface Event {
        id   :number
        time :number
    }

    export interface PartOfChain {
        chain :number
        position :number
    }

    export interface KeyState {
        code  :number
        mods? :Modifier[]
    }

    export interface InvolvesKey {
        key :KeyState
    }

    export type ChainedEvent =
        Event
        & PartOfChain


    export type KeyEvent =
        Event
        & InvolvesKey
        & PartOfChain


    export enum ICResultType {
        UNRECOGNIZED,
        RESOLVED
    }

    export interface InputChainUnrecognized {
        type :ICResultType.UNRECOGNIZED
    }

    export interface BrowserAction {
        name :string
    }

    export interface InputChainSelection {
        type :ICResultType.RESOLVED
        action :BrowserAction
    }

    export type InputChainResult =
        InputChainSelection
        | InputChainUnrecognized


    interface TypeFlag<T> {

    }

    export enum BrowserActionType {

    }

    const InterfaceInitializer =
        <TProps,TFlag>(otherProps :TProps, type :TFlag) => {
            return {

            }
        }
//}
