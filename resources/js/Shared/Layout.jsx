import MainMenu from "@/Shared/MainMenu";
import TopHeader from "@/Shared/TopHeader";
import BottomHeader from "@/Shared/BottomHeader";
import FlashMessages from "@/Shared/FlashMessages";
import { getWeb3 } from "@/utils";
import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";

export default function Layout({ children }) {
    const [web3, setWeb3] = useState(undefined);
    const [accounts, setAccounts] = useState(undefined);
    const { post } = useForm({
    });

    const isReady = () => {
        return (
            typeof web3 !== 'undefined'
            && typeof accounts !== 'undefined'
        );
    }

    if (isReady()) {
        window.ethereum.on('accountsChanged', accounts => {
            //account changed. Logout user
            post( route('logout'));
        });
    }

    useEffect(() => {
        const init = async () => {
            try {
                const web3 = await getWeb3();
                const accounts = await web3.eth.getAccounts();
                setWeb3(web3);
                setAccounts(accounts);
            } catch (error) {
                console.log(error);
                
            }
        }
        init();
    }, [])
    return (
        <>
            <p className="bg-green-400 text-center">Connected address: { accounts?.[0]}</p>
            <FlashMessages />
            <div className="flex flex-col">
                <div className="flex flex-col h-screen">
                    <div className="md:flex">
                        <TopHeader />
                        <BottomHeader />
                    </div>
                    <div className="flex flex-grow overflow-hidden">
                        <MainMenu className="flex-shrink-0 hidden w-56 p-6 overflow-y-auto bg-indigo-800 md:block" />
                        {/* To reset scroll region (https://inertiajs.com/pages#scroll-regions) add `scroll-region="true"` to div below */}
                        <div className="w-full px-4 py-8 overflow-hidden overflow-y-auto md:p-12">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
