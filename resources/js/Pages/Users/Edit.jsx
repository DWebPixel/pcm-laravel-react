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
import InputError from "@/Shared/InputError";
import Modal from "@/Shared/Modal";

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
        email: user.email || "",
        password: user.password || "",
        owner: user.owner ? "1" : "0" || "0",
        photo: "",
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
                        <div className="w-full pb-7 pr-6 lg:w-1/2">
                            <InputLabel
                                forInput="first_name"
                                value="First name:"
                            />
                            <TextInput
                                name="first_name"
                                value={data.first_name}
                                maxLength={25}
                                handleChange={(e) =>
                                    setData("first_name", e.target.value)
                                }
                            />
                            <InputError message={errors.first_name} />
                        </div>
                        <div className="w-full pb-7 pr-6 lg:w-1/2">
                            <InputLabel
                                forInput="last_name"
                                value="Last name:"
                            />
                            <TextInput
                                name="last_name"
                                value={data.last_name}
                                maxLength={25}
                                handleChange={(e) =>
                                    setData("last_name", e.target.value)
                                }
                            />
                            <InputError message={errors.last_name} />
                        </div>
                        <div className="w-full pb-7 pr-6 lg:w-1/2">
                            <InputLabel forInput="email" value="Email:" />
                            <TextInput
                                name="email"
                                type="email"
                                value={data.email}
                                maxLength={50}
                                handleChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            <InputError message={errors.email} />
                        </div>
                        <div className="w-full pb-7 pr-6 lg:w-1/2">
                            <InputLabel forInput="password" value="Password:" />
                            <TextInput
                                name="password"
                                type="password"
                                value={data.password}
                                handleChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />
                            <InputError message={errors.password} />
                        </div>
                        <div className="w-full pb-7 pr-6 lg:w-1/2">
                            <InputLabel forInput="owner" value="Owner:" />
                            <SelectInput
                                name="owner"
                                value={data.owner}
                                onChange={(e) =>
                                    setData("owner", e.target.value)
                                }
                            >
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </SelectInput>
                        </div>
                        <FileInput
                            className="w-full pb-8 pr-6 lg:w-1/2"
                            label="Photo"
                            name="photo"
                            accept="image/*"
                            errors={errors.photo}
                            value={data.photo}
                            onChange={(photo) => setData("photo", photo)}
                        />
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
