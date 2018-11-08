
export type TabId = number

export type URL = null

export enum TabState {
    OPEN,
    CLOSED
}

export interface Tab {
    id :TabId
    url :URL
    state :TabState
}


export interface History {
    
}

class TabOrigins extends Map<TabId,TabId> {
    constructor (

    ) {}
}

export interface BrowserState {
    tabs :Tab[],
    history :History
    origins :
}
