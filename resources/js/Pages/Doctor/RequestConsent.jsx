import { Link, useForm, Head } from "@inertiajs/react";
import Layout from "@/Shared/Layout";
import LoadingButton from "@/Shared/LoadingButton";
import TextInput from "@/Shared/TextInput";
import SelectInput from "@/Shared/SelectInput";
import FileInput from "@/Shared/FileInput";
import InputLabel from "@/Shared/InputLabel";
import InputError from "@/Shared//InputError";
import Checkbox from "@/Shared/Checkbox";

import { ethers } from "ethers";
import { contractABI, contractAddress } from "@/constants";

const RequestConsent = () => {
    
    const { data, setData, errors, post, processing, reset} = useForm({
        patient_address: "",
        access_type: "Read",
        purpose: {
            "GeneralPurpose": false,
            "Education": false,
            "E-Statistic": false,
            "E-MedicineDiscovery": false,
            "MedicalTreatment": false,
            "M-Cancer": false,
            "M-Diabetic": false,
            "M-Education": false,
            "M-Mental": false,
            "Insurance": false,
            "I-EvaluatelnsuranceStatus": false
            },  
        },
        // purpose: {
        //     GeneralPurpose: {
        //         value: false,
        //         Education: {
        //             value: false,
        //             "E-Statistic": {
        //                 value: false,
        //             },
        //             "E-MedicineDiscovery": {
        //                 value: false,
        //             }
        //         },
        //         MedicalTreatment: {
        //             value: false,
        //             "M-Cancer": {
        //                 value: false,
        //             },
        //             "M-Diabetic": {
        //                 value: false,
        //             },
        //             "M-Education": {
        //                 value: false,
        //             },
        //             "M-Mental": {
        //                 value: false,
        //             },
        //         },
        //         Insurance: {
        //             value: false,
        //             "I-EvaluatelnsuranceStatus": {
        //                 value: false,
        //             },
        //         },
        //     },  
        // }
    );

    const createEthereumContract = async () => {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
      
        return transactionsContract;
    };

    const getAccessTypeForBlockchain = (access_type) => {
        const reversedArray = {
            "Read" : 0,
            "Copy" : 1,
            "Write": 2
        };
        return reversedArray[access_type];
    }

    const getPuporseTypesForBlockchain = (purposes) => {
        const reversedArray = {
            "GeneralPurpose": 0,
            "Education": 1,
            "E-Statistic": 2,
            "E-MedicineDiscovery": 3,
            "MedicalTreatment": 4,
            "M-Cancer": 5,
            "M-Diabetic": 6,
            "M-Education": 7,
            "M-Mental": 8,
            "Insurance": 9,
            "I-EvaluatelnsuranceStatus": 10
        };

        var purposeTypes = [];

        for (const [key, value] of Object.entries(purposes)) {
            if( value ) {
                purposeTypes.push( reversedArray[key] )
            }
          }


        return purposeTypes;
    }


    const submitDataToBlockchain = async (consent) => {
        try {
            if (ethereum) {
                const transactionsContract = await createEthereumContract();

                var accessType = getAccessTypeForBlockchain(consent.access_type);
                var purposeTypes = getPuporseTypesForBlockchain(JSON.parse(consent.purpose));
                console.log({accessType})
                console.log({purposeTypes})
                const transactionHash = await transactionsContract.requestConsent(
                    consent.id,
                    consent.requestor_id,
                    consent.requestee_id,
                    consent.organization_id,
                    consent.role,
                    purposeTypes,
                    accessType
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

    function handleSubmit(e) {
        e.preventDefault();
        console.log(data);
        post(route("doctor.store-consent"), {
            preserveState: false,
            onSuccess: async (data) => {
                var consent = data.props?.data;
                console.log({consent})
                if( consent ) {
                    await submitDataToBlockchain(consent)
                }
            },
        });
    }

    const handleCheckboxChange = (type) => {
        const currentState = data['purpose'][type];
        setData("purpose", {
          ...data["purpose"],
          [type]: !currentState,
        });

        if( type == 'GeneralPurpose' ) {
            setData("purpose", {
                "GeneralPurpose": !currentState,
                "Education": !currentState,
                "E-Statistic": !currentState,
                "E-MedicineDiscovery": !currentState,
                "MedicalTreatment": !currentState,
                "M-Cancer": !currentState,
                "M-Diabetic": !currentState,
                "M-Education": !currentState,
                "M-Mental": !currentState,
                "Insurance": !currentState,
                "I-EvaluatelnsuranceStatus": !currentState
            });
        }

        if( type == 'Education' ) {
            setData("purpose", {
                ...data["purpose"],
                "Education": !currentState,
                "E-Statistic": !currentState,
                "E-MedicineDiscovery": !currentState,
            });
        }

        if( type == 'MedicalTreatment' ) {
            setData("purpose", {
                ...data["purpose"],
                "MedicalTreatment": !currentState,
                "M-Cancer": !currentState,
                "M-Diabetic": !currentState,
                "M-Education": !currentState,
                "M-Mental": !currentState,
            });
        }

        if( type == 'Insurance' ) {
            setData("purpose", {
                ...data["purpose"],
                "Insurance": !currentState,
                "I-EvaluatelnsuranceStatus": !currentState,
            });
        }

      };

    return (
        <>
            <Head title="Request Consent" />
            <div>
                <h1 className="mb-8 text-3xl font-bold">
                    {/* <Link
                        href={route("users.index")}
                        className="text-indigo-600 hover:text-indigo-700"
                    >
                        Consents
                    </Link> */}
                    {/* <span className="font-medium text-indigo-600"> /</span>{" "} */}
                    Request Consent
                </h1>
            </div>
            <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
                <form name="RequestConsentForm" onSubmit={handleSubmit}>
                    <div className="flex flex-wrap p-8 -mb-8 -mr-6">
                        <div className="w-full pb-7 pr-6">
                            <InputLabel
                                forInput="patient_address"
                                value="Patient Address:"
                            />
                            {/* <TextInput
                                name="patient_address"
                                value={data.patient_address}
                                maxLength={25}
                                handleChange={(e) =>
                                    setData("patient_address", e.target.value)
                                }
                            /> */}
                             <TextInput
                                name="patient_address"
                                value={data.patient_address}
                                handleChange={(e) =>
                                    setData("patient_address", e.target.value)
                                }
                            />
                            <InputError message={errors.patient_address} />
                        </div>
                        <div className="w-full pb-7 pr-6">
                            <InputLabel
                                forInput="purpose"
                                value="Purpose Type:"
                            />
                            <Checkbox
                                name="general_purpose"
                                value={data.purpose.GeneralPurpose}
                                handleChange={(e) =>
                                    handleCheckboxChange('GeneralPurpose')
                                }
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                General Purpose
                            </span>
                            <div className="ml-10">
                                <div>
                                    <div>
                                        <Checkbox
                                            name="education"
                                            value={data.purpose.Education}
                                            handleChange={(e) =>
                                                handleCheckboxChange('Education')
                                            }
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                            Education
                                        </span>
                                    </div>
                                    <div className="ml-10">
                                        <div>
                                            <Checkbox
                                                name="e-statistic"
                                                value={data.purpose['E-Statistic']}
                                                handleChange={(e) =>
                                                    handleCheckboxChange('E-Statistic')
                                                }
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                            E-Statistic
                                            </span>
                                        </div>
                                        <div>
                                            <Checkbox
                                                name="e-MedicineDiscovery"
                                                value={data.purpose['E-MedicineDiscovery']}
                                                handleChange={(e) =>
                                                    handleCheckboxChange('E-MedicineDiscovery')
                                                }
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                            E-MedicineDiscovery
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <Checkbox
                                            name="medicaltreatment"
                                            value={data.purpose.MedicalTreatment}
                                            handleChange={(e) =>
                                                handleCheckboxChange('MedicalTreatment')
                                            }
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                        MedicalTreatment
                                        </span>
                                    </div>
                                    <div className="ml-10">
                                        <div>
                                            <Checkbox
                                                name="m-cancer"
                                                value={data.purpose['M-Cancer']}
                                                handleChange={(e) =>
                                                    handleCheckboxChange('M-Cancer')
                                                }
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                            M-Cancer
                                            </span>
                                        </div>
                                        <div>
                                            <Checkbox
                                                name="m-diabetic"
                                                value={data.purpose['M-Diabetic']}
                                                handleChange={(e) =>
                                                    handleCheckboxChange('M-Diabetic')
                                                }
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                            M-Diabetic
                                            </span>
                                        </div>
                                        <div>
                                            <Checkbox
                                                name="m-education"
                                                value={data.purpose['M-Education']}
                                                handleChange={(e) =>
                                                    handleCheckboxChange('M-Education')
                                                }
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                            M-Education
                                            </span>
                                        </div>
                                        <div>
                                            <Checkbox
                                                name="m-mental"
                                                value={data.purpose['M-Mental']}
                                                handleChange={(e) =>
                                                    handleCheckboxChange('M-Mental')
                                                }
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                            M-Mental
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <Checkbox
                                            name="insurance"
                                            value={data.purpose.Insurance}
                                            handleChange={(e) =>
                                                handleCheckboxChange('Insurance')
                                            }
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                            Insurance
                                        </span>
                                    </div>
                                    <div className="ml-10">
                                        <div>
                                            <Checkbox
                                                name="i-evaluatelnsurancestatus"
                                                value={data.purpose['I-EvaluatelnsuranceStatus']}
                                                handleChange={(e) =>
                                                    handleCheckboxChange('I-EvaluatelnsuranceStatus')
                                                }
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                            I-EvaluatelnsuranceStatus
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <InputError message={errors.purpose} />
                        </div>
                        
                        <div className="w-full pb-7 pr-6 lg:w-1/2">
                            <InputLabel forInput="access_type" value="Access Type:" />
                            <SelectInput
                                name="access_type"
                                value={data.access_type}
                                onChange={(e) =>
                                    setData("access_type", e.target.value)
                                }
                            >
                                <option value="Read">Read</option>
                                <option value="Copy">Copy</option>
                                <option value="Write">Write</option>
                            </SelectInput>
                            <InputError message={errors.access_type} />
                        </div>
                        {/* <FileInput
                            className="w-full pb-8 pr-6 lg:w-1/2"
                            label="Photo"
                            name="photo"
                            accept="image/*"
                            errors={errors.photo}
                            value={data.photo}
                            onChange={(photo) => setData("photo", photo)}
                        /> */}
                    </div>
                    <div className="flex items-center justify-end px-8 py-4 bg-gray-100 border-t border-gray-200">
                        <LoadingButton
                            loading={processing}
                            type="submit"
                            className="btn-indigo"
                        >
                            Request Consent
                        </LoadingButton>
                    </div>
                </form>
            </div>
        </>
    );
};

RequestConsent.layout = (page) => <Layout title="Request Consent" children={page} />;

export default RequestConsent;
