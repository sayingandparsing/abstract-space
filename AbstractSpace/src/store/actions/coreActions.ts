import {
    Action
} from 'redux'



export const EXAMPLE = 'EXAMPLE'
export enum AsAction {
    START_ENGAGEMENT,
    ISSUE_COMMAND,
    UPDATE_VIEW,
    SET_CONTEXT,
}

export interface EngagementParameters {
    client :string
    treeName :string
    onRejection :Function
    requestId :number
}

export const startEngagement =
    (params :EngagementParameters) => ({
        type: AsAction.START_ENGAGEMENT,
        payload: params
    })

export const issueCommand =
    (commandId :string, args? :any[]) => ({
        type: AsAction.ISSUE_COMMAND,
        payload: {
            id: commandId,
            args: args
        }
    })

export const updateView =
    () => ({
        type: AsAction.UPDATE_VIEW,
        payload: {
        }
    })

export const setContext = null
