import { KeyEvent } from "../types/keyEvents";
import { CommandRef } from "../types/DataTypes";


export interface ISelectionClient {
    name :string
    commandFn :(CommandRef)=>void
    active :boolean

}

export const requestEngagement = async (client :ISelectionClient) => {

}
