export enum KeyModifier {
    CTRL,
    SHIFT,
    ALT,
    ALTGR,
    META,
    SUPER,
    HYPER
}

export interface KeyEvent {
    symbol :string
    modifiers? :KeyModifier[]
}


export interface HasSource {
    source :string
}


export type SourcedKeyEvent =
    KeyEvent
    & HasSource

