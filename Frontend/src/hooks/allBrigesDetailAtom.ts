import {atom} from "recoil"

// export enum chainType {
//     layerswapMain= "layerswapMain",
//     layerswapTestId =  "layerswapTestId",
//     orbturmMainId = "orbturmMainId"

// }

export const allBridgesDetailAtom = atom ({
    key: 'allBridgesDetailAtom',
    default: [
        { name: "LayerSwap-Testnet", time: "15 min", fee: "0.00", icon: "/placeholder.svg", minReceived: "0.0000", maxReceived: "0.0000" },
       
      ]
})

