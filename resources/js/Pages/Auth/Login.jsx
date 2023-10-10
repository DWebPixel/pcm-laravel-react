import Checkbox from "@/Shared/Checkbox";
import InputError from "@/Shared//InputError";
import InputLabel from "@/Shared/InputLabel";
import LoadingButton from "@/Shared/LoadingButton";
import TextInput from "@/Shared/TextInput";
import { Head, useForm } from "@inertiajs/react";
import Logo from "@/Shared/Logo";
import { getWeb3 } from "@/utils";
import { useEffect, useState, cloneElement } from "react"
import ABI from "@/Shared/abi.json";

export default function Login() {

    const [web3, setWeb3] = useState(undefined);
    const [accounts, setAccounts] = useState(undefined);

    const handleConnectToMetamask = async () => {
        try {
            const web3 = await getWeb3();
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = ABI.networks[networkId];
            if (deployedNetwork === undefined)
                throw new Error('Make sure you are on the corrent network. Set the network to Goerli Test Network');
            setWeb3(web3);
            const accounts = await web3.eth.getAccounts();
            setAccounts(accounts);
            setData('address', accounts?.[0]);
            console.log({accounts})
        } catch (error) {
            console.log(error);
            
        }
    }

    const { data, setData, post, processing, errors } = useForm({
        email: "johndoe@example.com",
        password: "Password@2023",
        address: "",
        remember: false,
    });

    const onHandleChange = (event) => {
        setData(
            event.target.name,
            event.target.type === "checkbox"
                ? event.target.checked
                : event.target.value
        );
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("login"));
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-6 bg-indigo-800">
            <Head title="Login" />

            <div className="w-full max-w-md">
                <Logo
                    className="block text-white text-2xl font-bold text-center"
                    height={50}
                />
                <form
                    onSubmit={submit}
                    className="mt-8 overflow-hidden bg-white rounded-lg shadow-xl"
                >
                    <div className="px-10 py-12">
                        <h1 className="text-3xl font-bold text-center">
                            Welcome Back!
                        </h1>
                        { accounts ? 
                        <div className="text-center px-2">
                            <p className="">Accounts:  { (accounts?.[0]) ? (accounts?.[0].slice(0, 10) + '...' + accounts?.[0].slice(-6) ) : "" }</p>
                        </div>
                        : 
                        (
                            <div className="flex justify-center py-2">
                                <LoadingButton
                                type="button"
                            onClick={() => handleConnectToMetamask()}
                        >
                            Connect to Metamask
                        </LoadingButton>
                            </div>
                        )
                        }     
                        <InputError message={errors.address} />

                        <div className="w-24 mx-auto mt-6 border-b-2" />

                        <div className="mt-6">
                            <InputLabel forInput="email" value="Email" />

                            <TextInput
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                isFocused={true}
                                handleChange={onHandleChange}
                            />

                            <InputError message={errors.email} />
                        </div>

                        <div className="mt-4">
                            <InputLabel forInput="password" value="Password" />

                            <TextInput
                                type="password"
                                name="password"
                                value={data.password}
                                autoComplete="current-password"
                                handleChange={onHandleChange}
                            />

                            <InputError message={errors.password} />
                        </div>

                        <label className="flex items-center mt-6 select-none">
                            <Checkbox
                                name="remember"
                                value={data.remember}
                                handleChange={onHandleChange}
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Remember me
                            </span>
                        </label>
                    </div>

                    <div className="flex items-center justify-end px-10 py-4 bg-gray-100 border-t border-gray-200">
                        <LoadingButton
                            className="ml-auto"
                            processing={processing}
                        >
                            Log in
                        </LoadingButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
