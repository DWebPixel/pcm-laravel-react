import { getWeb3 } from "@/utils";
import { useEffect, useState, cloneElement } from "react"
import ABI from "./abi.json";


const ConnectToWeb3 = ({children}) => {
    const [web3, setWeb3] = useState(undefined);
    const [accounts, setAccounts] = useState(undefined);
    const [contract, setContract] = useState(undefined);
    useEffect(() => {
        const init = async () => {
            try {
                const web3 = await getWeb3();
                const accounts = await web3.eth.getAccounts();
                const networkId = await web3.eth.net.getId();
                const deployedNetwork = ABI.networks[networkId];
                if (deployedNetwork === undefined)
                    throw new Error('Make sure you are on the corrent network. Set the network to Goerli Test Network');
                const contract = new web3.eth.Contract(
                    ABI.abi,
                    deployedNetwork && deployedNetwork.address,
                );
                console.log({accounts})
                setWeb3(web3);
                setAccounts(accounts);
                setContract(contract);
            } catch (error) {
                console.log(error);
                
            }
        }
        init();
    }, [])
    const newChild = cloneElement(children, {
        account: accounts?.[0],
      });

    return <>
        <div>
            <p>Accounts: {accounts?.[0]}</p>
        </div>
        {newChild}
    </>
}

export default ConnectToWeb3