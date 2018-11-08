export type NodeSymbol = string;


export interface Node {
    data: NodeData
}

export interface RootNode {
    data :NodeData
    subtree :AnyNode[]
}

export type AnyNode = PathNode
                    | TermNode
                    | RootNode

export interface PathNode extends Node {
    data: NodeData
    subtree: AnyNode[]
}


export interface TermNode extends Node {
    data: NodeData
    command: number | object
}

export type CommandRef = string;


export interface Failure {
    path: NodeSymbol[]
}


export type Connections = NodeData[]


export interface NodeData {
    symbol: NodeSymbol
	lab: string
	nested :boolean
	fn ?: string
}


export interface Command {
    type: String
    arg: String
}


export type DescentContext = {
    root: RootNode;
    current: AnyNode;
    level: Connections;
    path: NodeSymbol[];
    commandCb? :Function
}

export interface ProcessResultMessage {
    event: ProcessState
    command: String
}


export enum ProcessState {
    COMPLETED,
    FAILED,
    TERMINATED
}
