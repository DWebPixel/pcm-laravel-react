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
        is_patient: user.is_patient ? "1" : "0" || "0",
        _method: "PUT",
    });

    console.log(user.deleted_at);

    function handleSubmit(e) {
        e.preventDefault();

        post(route("users.update", user.id));
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
                            label="is_patient"
                            value="Role:"
                            errors={errors.is_patient}
                        >
                            <SelectInput
                                name="is_patient"
                                value={data.is_patient}
                                onChange={(e) =>
                                    setData("is_patient", e.target.value)
                                }
                            >
                                <option value="1">Patient</option>
                                <option value="0">User</option>
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
        </>
    );
};

Edit.layout = (page) => <Layout children={page} />;

export default Edit;
