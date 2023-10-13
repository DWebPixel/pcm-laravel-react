import { Link, usePage, Head, useForm } from "@inertiajs/react";
import Layout from "@/Shared/Layout";
import Icon from "@/Shared/Icon";
import Pagination from "@/Shared/Pagination";
import SearchFilter from "@/Shared/SearchFilter";
import AnchorLink from "@/Shared/AnchorLink";
import LoadingButton from "@/Shared/LoadingButton";
import DangerButton from "@/Shared/DangerButton";
import Modal from "@/Shared/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import InputLabel from "@/Shared/InputLabel";
import TextInput from "@/Shared/TextInput";
import Checkbox from "@/Shared/Checkbox";

import { ethers } from "ethers";
import { contractABI, contractAddress } from "@/constants";
import { useState } from "react";

const ConsentRequests = () => {
    const { requests } = usePage().props;
    const { data: requestedData, links } = requests;
    const [showModal, setShowModal] = useState(false);


    const { data, setData, errors, post, processing } = useForm({
        consent_id: "",
        expiry_date: "",
        onlyOnce: false
    });

    const createEthereumContract = async () => {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
      
        return transactionsContract;
    };

    const grantConsentOnBlockchain = async (consent) => {
        try {
            if (ethereum) {
                const transactionsContract = await createEthereumContract();

                var epoch = Date.parse(consent.expiry_date)/1000;
                const transactionHash = await transactionsContract.grantConsent(
                    consent.id,
                    epoch
                );

                console.log(transactionHash);
            } else {
            console.log("No ethereum object");
            }
        } catch (error) {
            console.log(error);
    
            throw new Error("No ethereum object");
        }
    }
    
    const denyConsentOnBlockchain = async (consent) => {
        try {
            if (ethereum) {
                const transactionsContract = await createEthereumContract();

                var epoch = Date.parse(consent.denied_on)/1000;
                const transactionHash = await transactionsContract.denyConsent(
                    consent.id,
                    epoch
                );

                console.log(transactionHash);
            } else {
            console.log("No ethereum object");
            }
        } catch (error) {
            console.log(error);
    
            throw new Error("No ethereum object");
        }
    } 

    const grantPermission = () => {
        console.log({data});
        post(route('patient.update-consent', [data.consent_id, 'granted']), {
            preserveState: false,
            onSuccess: async (data) => {
                var consent = data.props?.data;
                console.log({consent})
                console.log(consent.expiry_date)
                if( consent ) {
                    await grantConsentOnBlockchain(consent)
                }
            },
        });
    }

    const denyPermission = (id) => {
        post(route('patient.update-consent', [id, 'denied']),{
            preserveState: false,
            onSuccess: async (data) => {
                var consent = data.props?.data;
                console.log({consent})
                if( consent ) {
                    await denyConsentOnBlockchain(consent)
                }
            },
        })
    }

    const onHandleChange = (event) => {
        setData(
            event.target.name,
            event.target.type === "checkbox"
                ? event.target.checked
                : event.target.value
        );
    };

    return (
        <>
            <Head title="Patients" />
            <h1 className="mb-8 text-3xl font-bold">Consent Requests</h1>
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="w-full whitespace-nowrap">
                    <thead>
                        <tr className="font-bold text-left">
                            <th className="px-6 pt-5 pb-4">Requestor Name</th>
                            <th className="px-6 pt-5 pb-4">Organization</th>
                            <th className="px-6 pt-5 pb-4">Role</th>
                            <th className="px-6 pt-5 pb-4">Access Type</th>
                            <th className="px-6 pt-5 pb-4">Purpose</th>
                            <th className="px-6 pt-5 pb-4">Requested On</th>
                            <th className="px-6 pt-5 pb-4">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {requestedData.map(
                            ({
                                id,
                                requestor_name,
                                organization,
                                role,
                                access_type,
                                purpose,
                                requested_at,
                            }) => (
                                <tr
                                    key={id}
                                    className="hover:bg-gray-100 focus-within:bg-gray-100"
                                >
                                    <td className="border-t px-6">
                                        {requestor_name}
                                    </td>
                                    <td className="border-t px-6">
                                        {organization}
                                    </td>
                                    <td className="border-t px-6">
                                        {role}
                                    </td>
                                    <td className="border-t px-6">
                                        {access_type}
                                    </td>
                                    <td className="border-t px-6">
                                        {purpose.map((item, index) => <p key={index}>{item}</p>)}
                                    </td>
                                    <td className="border-t px-6">
                                        {requested_at}
                                    </td>
                                    <td className="border-t px-6">
                                        <div className="flex gap-2 items-center h-full">
                                        <LoadingButton
                                            onClick={() => {
                                                setShowModal(true); 
                                                setData('consent_id', id);
                                            }}
                                            type="button"
                                            processing={processing}
                                        >
                                            Grant
                                        </LoadingButton>
                                        <DangerButton
                                            className="py-3 px-6"
                                            processing={processing}
                                            type="button"
                                            onClick={() => denyPermission(id)}
                                        >
                                            Deny
                                        </DangerButton>
                                        </div>
                                    </td>
                                </tr>
                            )
                        )}
                        {data.length === 0 && (
                            <tr>
                                <td className="px-6 py-4 border-t" colSpan="7">
                                    No consent requests found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Pagination links={links} />
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Grant Permission
                    </h2>
                    <form onSubmit={grantPermission}>
                        <div className="flex flex-wrap p-8 -mb-8 -mr-6 items-center space-x-8">
                            <div className="w-full lg:w-1/2">
                                <InputLabel forInput="name" value="Consent Valid Till Date:" />
                                <TextInput
                                    name="expiry_date"
                                    type="date"
                                    value={data.expiry_date}
                                    maxLength={100}
                                    handleChange={(e) =>
                                        setData("expiry_date", e.target.value)
                                    }
                                />
                            </div>
                            <label className="flex items-center mt-6 select-none">
                                <Checkbox
                                    name="onlyOnce"
                                    value={data.onlyOnce}
                                    handleChange={onHandleChange}
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    Only Once
                                </span>
                            </label>
                        </div>
                    </form>            
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </SecondaryButton>

                        <DangerButton
                            className="ml-3"
                            processing={processing}
                            type="button"
                            onClick={grantPermission}
                        >
                            Grant Permission
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </>
    );
};

ConsentRequests.layout = (page) => <Layout title="Consent Requests" children={page} />;

export default ConsentRequests;
