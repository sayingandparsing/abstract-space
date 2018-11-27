import {
    createStore,
    Store,
    compose,
    applyMiddleware,
    Middleware
} from 'redux'

/* import {
    Map
} from 'immutable' */

import combinedReducer from './combinedReducer'
import {DescentContext} from "../types/DataTypes"

export type TreeResolver = Function

export interface ASConfig {}

/* const prepareInitialState :(ASConfig)=>()=>SpaceState =
     (opts :ASConfig) => {
        const trees :Map<string,TreeResolver> = new Map()
        return () => ({
            trees: trees,
            context: {},//: Map(),
            activeClient: null,
        })
}

prepareInitialState({}) */

export interface SpaceState {
    trees :Map<string,TreeResolver>
    context :DescentContext
    activeClient :string | null
}

export const store :Store = createStore(combinedReducer)
