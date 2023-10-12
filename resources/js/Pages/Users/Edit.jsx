import { useState } from "react";
import { Link, usePage, useForm, Head } from "@inertiajs/react";
import Layout from "@/Shared/Layout";
import DeleteButton from "@/Shared/DeleteButton";
import LoadingButton from "@/Shared/LoadingButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Shared/DangerButton";
import TextInput from "@/Shared/TextInput";
import SelectInput from "@/Shared/SelectInput";
import FileInput from "@/Shared/FileInput";
import TrashedMessage from "@/Shared/TrashedMessage";
import InputLabel from "@/Shared/InputLabel";
import InputError from "@/Shared//InputError";
import Modal from "@/Shared/Modal";
import { Field } from "@/Components/Form/Field";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "@/constants";

const Edit = () => {
    const [showModal, setShowModal] = useState(false);

    const { user } = usePage().props;
    const {
        data,
        setData,
        errors,
        post,
        processing,
        delete: destroy,
        put,
    } = useForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        address: user.address || "",
        bc_address: user.bc_address || "",
        email: user.email || "",
        contact: user.contact || "",
        password: user.password || "",
        role: user.role,
        _method: "PUT",
    });


    const patientFields = {
        dob: user.metas?.dob || "",
        occupation: user.metas?.occupation || "",
        emergency_contact: user.metas?.emergency_contact || "",
        emergency_contact_phone: user.metas?.emergency_contact_phone || "",
        medicare_card_id: user.metas?.medicare_card_id || "",
        medicare_card_number: user.metas?.medicare_card_number || "",
        private_health_care: user.metas?.private_health_care || "Yes"
    }

    const doctorFields = {
        speciality: user.metas?.speciality || "General Practitioner",
        registration_no: user.metas?.registration_no || ""
    }

    const metaFields = user.role == 'Patient' ? patientFields : (user.role == 'Doctor' ? doctorFields : {})

    const {
        data: metaData,
        setData : setMetaData,
        errors: metaErrors,
        post: metaPost,
        processing: metaProcessing,
    } = useForm(metaFields);

    
    const createEthereumContract = async () => {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
      
        return transactionsContract;
    };

    const updateUserOnBlockchain = async (user) => {
        try {
            if (ethereum) {
                const transactionsContract = await createEthereumContract();
                const transactionHash = await transactionsContract.updateUser(
                    user.id,
                    user.first_name,
                    user.last_name,
                    user.email,
                    user.contact,
                    user.bc_address,
                    user.address,
                    user.role
                );  
                console.log(transactionHash.hash);
            } else {
            console.log("No ethereum object");
            }
        } catch (error) {
            console.log(error);
    
            throw new Error("No ethereum object");
        }
    }  

    const updateUserMetaDataOnBlockchain = async (id, data) => {
        try {
            if (ethereum) {
                const transactionsContract = await createEthereumContract();
                const transactionHash = await transactionsContract.updateAdditionalDataUser(id, data);  
                console.log(transactionHash.hash);
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

        post(route("users.update", user.id), {
            preserveState: true,
            onSuccess: async (data) => {
                var user = data.props?.data;
                console.log({user})
                if( user ) {
                   await updateUserOnBlockchain(user)
                }
            },
        });
    }

    function handleAdditionalDetailsSubmit(e) {
        e.preventDefault();
        
        metaPost(route("users.update_meta", user.id), {
            preserveState: true,
            onSuccess: async (data) => {
                var userData = data.props?.data;
                console.log({userData})
                console.log(JSON.stringify(userData).replace(/"/g, ''))
                if( userData ) {
                    await updateUserMetaDataOnBlockchain(user.id , JSON.stringify(userData).replace(/"/g, ''))
                }
            },
        });
    }

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route("users.destroy", user.id), {
            onFinish: () => setShowModal(false),
        });
    };

    const restoreUser = (e) => {
        e.preventDefault();

        put(route("users.restore", user.id), {
            onFinish: () => setShowModal(false),
        });
    };

    function modalContent() {
        const bodyModal = user.deleted_at
            ? "Are you sure you want to restore this user?"
            : "Are you sure you want to delete this user?";
        const actionModal = user.deleted_at ? restoreUser : deleteUser;
        return (
            <>
                {user.deleted_at ? (
                    <TrashedMessage onRestore={() => setShowModal(true)}>
                        This user has been deleted.
                    </TrashedMessage>
                ) : (
                    <DeleteButton onClick={() => setShowModal(true)}>
                        Delete User
                    </DeleteButton>
                )}
                <Modal show={showModal} onClose={() => setShowModal(false)}>
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900">
                            {bodyModal}
                        </h2>

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
                                onClick={actionModal}
                            >
                                {user.deleted_at
                                    ? "Restore User"
                                    : "Delete User"}
                            </DangerButton>
                        </div>
                    </div>
                </Modal>
            </>
        );
    }

    return (
        <>
            <Head title={`${data.first_name} ${data.last_name}`} />
            <div className="flex justify-start max-w-lg mb-8">
                <h1 className="text-3xl font-bold">
                    <Link
                        href={route("users.index")}
                        className="text-indigo-600 hover:text-indigo-700"
                    >
                        Users
                    </Link>
                    <span className="mx-2 font-medium text-indigo-600">/</span>
                    {data.first_name} {data.last_name}
                </h1>
                {user.photo && (
                    <img
                        className="block w-8 h-8 ml-4 rounded-full"
                        src={user.photo}
                    />
                )}
            </div>
            {!user.can_delete ? (
                <div className="max-w-3xl mb-6 p-4 bg-yellow-400 rounded border border-yellow-500">
                    <div className="text-yellow-800">
                        Updating the demo user is not allowed.
                    </div>
                </div>
            ) : (
                user.deleted_at && modalContent()
            )}
            <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap p-8 -mb-8 -mr-6">
                        <Field
                            label="first_name"
                            value="First name:"
                            errors={errors.first_name}
                        >
                            <TextInput
                                name="first_name"
                                value={data.first_name}
                                maxLength={25}
                                handleChange={(e) =>
                                    setData("first_name", e.target.value)
                                }
                            />
                        </Field>

                        <Field
                            label="last_name"
                            value="Last name:"
                            errors={errors.last_name}
                        >
                            <TextInput
                                name="last_name"
                                value={data.last_name}
                                maxLength={25}
                                handleChange={(e) =>
                                    setData("last_name", e.target.value)
                                }
                            />
                        </Field>

                        <Field
                            label="email"
                            value="Email:"
                            errors={errors.email}
                        >
                            <TextInput
                                name="email"
                                type="email"
                                value={data.email}
                                maxLength={50}
                                handleChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                        </Field>

                        <Field
                            label="contact"
                            value="Contact:"
                            errors={errors.contact}
                        >
                            <TextInput
                                name="contact"
                                type="contact"
                                value={data.contact}
                                maxLength={50}
                                handleChange={(e) =>
                                    setData("contact", e.target.value)
                                }
                            />
                        </Field>

                        <Field
                            label="bc_address"
                            value="Blockchain Address:"
                            errors={errors.bc_address}
                        >
                            <TextInput
                                name="bc_address"
                                type="bc_address"
                                value={data.bc_address}
                                maxLength={50}
                                handleChange={(e) =>
                                    setData("bc_address", e.target.value)
                                }
                            />
                        </Field>


                        <Field
                            label="address"
                            value="Address:"
                            errors={errors.address}
                        >
                            <TextInput
                                name="address"
                                type="address"
                                value={data.address}
                                maxLength={50}
                                handleChange={(e) =>
                                    setData("address", e.target.value)
                                }
                            />
                        </Field>

                        <Field
                            label="password"
                            value="Password:"
                            errors={errors.password}
                        >
                            <TextInput
                                name="password"
                                type="password"
                                value={data.password}
                                handleChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />
                        </Field>

                        <Field
                            label="role"
                            value="Role:"
                            errors={errors.role}
                        >
                            <SelectInput
                                name="role"
                                value={data.role}
                                onChange={(e) =>
                                    setData("role", e.target.value)
                                }
                            >
                                <option value="Patient">Patient</option>
                                <option value="Doctor">Doctor</option>
                                <option value="Nurse">Nurse</option>
                                <option value="Sales Agent">Sales Agent</option>
                                <option value="Medical Representative">Medical Representative</option>
                                <option value="Admin">Admin</option>
                            </SelectInput>
                        </Field>

                    </div>
                    <div className="flex items-center px-8 py-4 bg-gray-100 border-t border-gray-200">
                        {!user.deleted_at && user.can_delete && modalContent()}
                        <LoadingButton
                            processing={processing}
                            disabled={!user.can_delete}
                            type="submit"
                            className="ml-auto btn-indigo"
                        >
                            Update User
                        </LoadingButton>
                    </div>
                </form>
            </div>


            { data.role == 'Patient' && (<div className="max-w-3xl overflow-hidden bg-white rounded shadow">
                <h2 className="px-8 pt-4 text-xl font-bold">Additional Details</h2>
                <form onSubmit={handleAdditionalDetailsSubmit}>
                    <div className="flex flex-wrap p-8 -mb-8 -mr-6">
                        <Field
                            label="dob"
                            value="Date Of Birth:"
                            errors={metaErrors.dob}
                        >
                            <TextInput
                                name="dob"
                                type="date"
                                value={metaData.dob}
                                maxLength={25}
                                handleChange={(e) =>

                                    setMetaData("dob", e.target.value)
                                }
                            />
                        </Field>

                        <Field
                            label="occupation"
                            value="Occupation:"
                            errors={metaErrors.occupation}
                        >
                            <TextInput
                                name="occupation"
                                value={metaData.occupation}
                                maxLength={25}
                                handleChange={(e) =>
                                    setMetaData("occupation", e.target.value)
                                }
                            />
                        </Field>

                        <Field
                            label="emergency_contact"
                            value="Emergency Contact Person:"
                            errors={metaErrors.emergency_contact}
                        >
                            <TextInput
                                name="emergency_contact"
                                type="emergency_contact"
                                value={metaData.emergency_contact}
                                maxLength={50}
                                handleChange={(e) =>
                                    setMetaData("emergency_contact", e.target.value)
                                }
                            />
                        </Field>

                        <Field
                            label="emergency_contact_phone"
                            value="Emergency Contact Phone:"
                            errors={metaErrors.emergency_contact_phone}
                        >
                            <TextInput
                                name="emergency_contact_phone"
                                type="emergency_contact_phone"
                                value={metaData.emergency_contact_phone}
                                maxLength={50}
                                handleChange={(e) =>
                                    setMetaData("emergency_contact_phone", e.target.value)
                                }
                            />
                        </Field>

                        <Field
                            label="medicare_card_number"
                            value="Medicare Card Number:"
                            errors={metaErrors.medicare_card_number}
                        >
                            <TextInput
                                name="medicare_card_number"
                                type="medicare_card_number"
                                value={metaData.medicare_card_number}
                                maxLength={50}
                                handleChange={(e) =>
                                    setMetaData("medicare_card_number", e.target.value)
                                }
                            />
                        </Field>


                        <Field
                            label="medicare_card_id"
                            value="Medicare Card Person ID:"
                            errors={metaErrors.medicare_card_id}
                        >
                            <TextInput
                                name="medicare_card_id"
                                type="medicare_card_id"
                                value={metaData.medicare_card_id}
                                maxLength={50}
                                handleChange={(e) =>
                                    setMetaData("medicare_card_id", e.target.value)
                                }
                            />
                        </Field>

                        <Field
                            label="private_health_care"
                            value="Private Health Care:"
                            errors={metaErrors.private_health_care}
                        >
                            <SelectInput
                                name="private_health_care"
                                value={metaData.private_health_care}
                                onChange={(e) =>
                                    setMetaData("private_health_care", e.target.value)
                                }
                            >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </SelectInput>
                        </Field>

                    </div>
                    <div className="flex items-center px-8 py-4 bg-gray-100 border-t border-gray-200">
                        <LoadingButton
                            processing={metaProcessing}
                            type="submit"
                            className="ml-auto btn-indigo"
                        >
                            Update Additional Details
                        </LoadingButton>
                    </div>
                </form>
            </div>)}

            { data.role == 'Doctor' && (<div className="max-w-3xl overflow-hidden bg-white rounded shadow">
                <h2 className="px-8 pt-4 text-xl font-bold">Additional Details</h2>
                <form onSubmit={handleAdditionalDetailsSubmit}>
                    <div className="flex flex-wrap p-8 -mb-8 -mr-6">
                        <Field
                            label="speciality"
                            value="Speciality:"
                            errors={metaErrors.speciality}
                        >
                            <SelectInput
                                name="speciality"
                                value={metaData.speciality}
                                onChange={(e) =>
                                    setMetaData("speciality", e.target.value)
                                }
                            >
                                <option value="General Practitioner">General Practitioner</option>
                                <option value="Oncologist">Oncologist</option>
                                <option value="Diabetologist">Diabetologist</option>
                                <option value="Cardiologist">Cardiologist</option>
                                <option value="Gynecologist">Gynecologist</option>
                            </SelectInput>
                        </Field>

                        <Field
                            label="registration_no"
                            value="Registration No:"
                            errors={metaErrors.registration_no}
                        >
                            <TextInput
                                name="registration_no"
                                value={metaData.registration_no}
                                maxLength={25}
                                handleChange={(e) =>
                                    setMetaData("registration_no", e.target.value)
                                }
                            />
                        </Field>

                    </div>
                    <div className="flex items-center px-8 py-4 bg-gray-100 border-t border-gray-200">
                        <LoadingButton
                            processing={metaProcessing}
                            type="submit"
                            className="ml-auto btn-indigo"
                        >
                            Update Additional Details
                        </LoadingButton>
                    </div>
                </form>
            </div>)}
        </>
    );
};

Edit.layout = (page) => <Layout children={page} />;

export default Edit;
