import MainMenu from "@/Shared/MainMenu";
import TopHeader from "@/Shared/TopHeader";
import BottomHeader from "@/Shared/BottomHeader";
import FlashMessages from "@/Shared/FlashMessages";
import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";

export default function Layout({ children }) {
    const [currentAccount, setCurrentAccount] = useState(undefined);
    const { post } = useForm({
    });

    useEffect(() => {
        const checkIfWalletIsConnect = async () => {
            try {
              if (!ethereum) return alert("Please install MetaMask.");
        
              const accounts = await ethereum.request({ method: "eth_accounts" });
        
              if (accounts.length) {
                setCurrentAccount(accounts[0]);
        
              } else {
                console.log("No accounts found");
              }
            } catch (error) {
              console.log(error);
            }
          };
        checkIfWalletIsConnect();  
    }, [])

    if (window.ethereum && currentAccount) {
        window.ethereum.on('accountsChanged', accounts => {
            //account changed. Logout user
            post( route('logout'));
        });
    }

    return (
        <>
            <p className="bg-green-400 text-center">Connected address: { currentAccount }</p>
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
