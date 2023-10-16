import { Link, useForm, Head } from "@inertiajs/react";
import Layout from "@/Shared/Layout";
import LoadingButton from "@/Shared/LoadingButton";
import TextInput from "@/Shared/TextInput";
import SelectInput from "@/Shared/SelectInput";
import InputLabel from "@/Shared/InputLabel";
import InputError from "@/Shared//InputError";
import { useEffect, useState } from "react";

import { ethers } from "ethers";
import { contractABI, contractAddress } from "@/constants";

const Create = () => {
    
    const { data, setData, errors, post, processing } = useForm({
        name: "",
        phone: "",
        address: "",
        type: "hospital",
    });

    const createEthereumContract = async () => {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
      
        return transactionsContract;
    };

    const submitDataToBlockchain = async (organization) => {
        try {
            if (ethereum) {
                const transactionsContract = await createEthereumContract();
                const transactionHash = await transactionsContract.addOrganization(organization.id, organization.name, organization.type , organization.phone, organization.address);
                console.log(transactionHash);
            } else {
            console.log("No ethereum object");
            }
        } catch (error) {
            console.log(error);
    
            throw new Error("No ethereum object");
        }
    }    

    const handleSubmit = async (e) => {
        e.preventDefault();
        post(route("organizations.store"), {
            preserveState: false,
            onSuccess: async (data) => {
                var organization = data.props?.data;
                console.log({organization})
                if( organization ) {
                    await submitDataToBlockchain(organization)
                    window.location.href = route('organizations.index')
                }
            },
        });
    }

    return (
        <>
            <Head title="Create Organization" />
            <h1 className="mb-8 text-3xl font-bold">
                <Link
                    href={route("organizations.index")}
                    className="text-indigo-600 hover:text-indigo-700"
                >
                    Organizations
                </Link>
                <span className="font-medium text-indigo-600"> /</span> Create

                <button type="button" onClick={handleSubmit}>Submit</button>
            </h1>
            <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap p-8 -mb-8 -mr-6">
                        <div className="w-full pb-7 pr-6 lg:w-1/2">
                            <InputLabel forInput="name" value="Name:" />
                            <TextInput
                                name="name"
                                value={data.name}
                                maxLength={100}
                                handleChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="w-full pb-7 pr-6 lg:w-1/2">
                            <InputLabel forInput="type" value="Type:" />
                            <SelectInput
                                name="type"
                                value={data.type}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                            >
                                <option value="hospital">Hospital</option>
                                <option value="insurance_company">Insurance Company</option>
                                <option value="pharma_company">Pharma Company</option>
                            </SelectInput>
                            <InputError message={errors.type} />
                        </div>

                        <div className="w-full pb-7 pr-6 lg:w-1/2">
                            <InputLabel forInput="phone" value="Phone:" />
                            <TextInput
                                name="phone"
                                value={data.phone}
                                maxLength={50}
                                handleChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                            />
                            <InputError message={errors.phone} />
                        </div>
                        <div className="w-full pb-7 pr-6 lg:w-1/2">
                            <InputLabel forInput="adsress" value="Address:" />
                            <TextInput
                                name="address"
                                value={data.address}
                                maxLength={150}
                                handleChange={(e) =>
                                    setData("address", e.target.value)
                                }
                            />
                            <InputError message={errors.address} />
                        </div>
                    </div>
                    <div className="flex items-center justify-end px-8 py-4 bg-gray-100 border-t border-gray-200">
                        <LoadingButton
                            loading={processing}
                            type="submit"
                            className="btn-indigo"
                        >
                            Create Organization
                        </LoadingButton>
                    </div>
                </form>
            </div>
        </>
    );
};

Create.layout = (page) => (
    <Layout title="Create Organization" children={page} />
);

export default Create;
