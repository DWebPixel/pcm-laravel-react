import { useState } from "react";
import { Link, usePage, useForm, Head } from "@inertiajs/react";
import Layout from "@/Shared/Layout";
import DeleteButton from "@/Shared/DeleteButton";
import LoadingButton from "@/Shared/LoadingButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Shared/DangerButton";
import TextInput from "@/Shared/TextInput";
import SelectInput from "@/Shared/SelectInput";
import TrashedMessage from "@/Shared/TrashedMessage";
import Icon from "@/Shared/Icon";
import Modal from "@/Shared/Modal";
import { Field } from "@/Components/Form/Field";

const Edit = () => {
    const [showModal, setShowModal] = useState(false);

    const { organization } = usePage().props;
    const {
        data,
        setData,
        errors,
        put,
        processing,
        delete: destroy,
    } = useForm({
        name: organization.name || "",
        type: organization.type || "",
        phone: organization.phone || "",
        address: organization.address || "",
    });

    function handleSubmit(e) {
        e.preventDefault();

        put(route("organizations.update", organization.id));
    }

    const deleteOrganization = (e) => {
        e.preventDefault();

        destroy(route("organizations.destroy", organization.id), {
            onFinish: () => setShowModal(false),
        });
    };

    const restoreOrganization = (e) => {
        e.preventDefault();

        put(route("organizations.restore", organization.id), {
            onFinish: () => setShowModal(false),
        });
    };

    function modalContent() {
        const bodyModal = organization.deleted_at
            ? "Are you sure you want to restore this organization?"
            : "Are you sure you want to delete this organization?";
        const actionModal = organization.deleted_at
            ? restoreOrganization
            : deleteOrganization;
        return (
            <>
                {organization.deleted_at ? (
                    <TrashedMessage onRestore={() => setShowModal(true)}>
                        This organization has been deleted.
                    </TrashedMessage>
                ) : (
                    <DeleteButton onClick={() => setShowModal(true)}>
                        Delete Organization
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
                                {organization.deleted_at
                                    ? "Restore Organization"
                                    : "Delete Organization"}
                            </DangerButton>
                        </div>
                    </div>
                </Modal>
            </>
        );
    }

    return (
        <>
            <Head title={data.name} />
            <h1 className="mb-8 text-3xl font-bold">
                <Link
                    href={route("organizations.index")}
                    className="text-indigo-600 hover:text-indigo-700"
                >
                    Organizations
                </Link>
                <span className="mx-2 font-medium text-indigo-600">/</span>
                {data.name}
            </h1>
            {organization.deleted_at && modalContent()}
            <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap p-8 -mb-8 -mr-6">
                        <Field label="name" value="Name:" errors={errors.name}>
                            <TextInput
                                name="name"
                                value={data.name}
                                maxLength={100}
                                handleChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                        </Field>

                        <Field
                            label="type"
                            value="Role:"
                            errors={errors.type}
                        >
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
                        </Field>

                        <Field
                            label="phone"
                            value="Phone:"
                            errors={errors.phone}
                        >
                            <TextInput
                                name="phone"
                                value={data.phone}
                                maxLength={50}
                                handleChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                            />
                        </Field>

                        <Field
                            label="adsress"
                            value="Address:"
                            errors={errors.adsress}
                        >
                            <TextInput
                                name="address"
                                value={data.address}
                                maxLength={150}
                                handleChange={(e) =>
                                    setData("address", e.target.value)
                                }
                            />
                        </Field>
                    </div>
                    <div className="flex items-center px-8 py-4 bg-gray-100 border-t border-gray-200">
                        {!organization.deleted_at && modalContent()}
                        <LoadingButton
                            processing={processing}
                            type="submit"
                            className="ml-auto"
                        >
                            Update Organization
                        </LoadingButton>
                    </div>
                </form>
            </div>
            <div className="flex mt-12 justify-between">
                <h2 className=" text-2xl font-bold">Users</h2>
                <Link
                    href={route('organizations.create_user', organization)}
                    className="px-6 py-3 rounded bg-indigo-600 text-white text-sm leading-4 font-bold whitespace-nowrap hover:bg-orange-400 focus:bg-orange-400 transition ease-in-out duration-150"
                >
                    <div className="">Add User</div>
                </Link>
            </div>
            <div className="mt-6 overflow-x-auto bg-white rounded shadow">
                <table className="w-full whitespace-nowrap">
                    <thead>
                        <tr className="font-bold text-left">
                            <th className="px-6 pt-5 pb-4">Name</th>
                            <th className="px-6 pt-5 pb-4">Role</th>
                            <th className="px-6 pt-5 pb-4">Blockchain Address</th>
                            <th className="px-6 pt-5 pb-4" colSpan="2">
                                Email
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {organization.users?.map(
                            ({ id, name, email, bc_address, deleted_at, role }) => {
                                return (
                                    <tr
                                        key={id}
                                        className="hover:bg-gray-100 focus-within:bg-gray-100"
                                    >
                                        <td className="border-t">
                                            <Link
                                                href={route(
                                                    "users.edit",
                                                    id
                                                )}
                                                className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                                            >
                                                {name}
                                                {deleted_at && (
                                                    <Icon
                                                        name="trash"
                                                        className="flex-shrink-0 w-3 h-3 ml-2 text-gray-400 fill-current"
                                                    />
                                                )}
                                            </Link>
                                        </td>
                                        <td className="border-t">
                                            <Link
                                                tabIndex="-1"
                                                href={route(
                                                    "users.edit",
                                                    id
                                                )}
                                                className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none capitalize"
                                            >
                                                {role}
                                            </Link>
                                        </td>
                                        <td className="border-t">
                                            <Link
                                                tabIndex="-1"
                                                href={route(
                                                    "users.edit",
                                                    id
                                                )}
                                                className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                                            >
                                                {bc_address}
                                            </Link>
                                        </td>
                                        <td className="border-t">
                                            <Link
                                                tabIndex="-1"
                                                href={route(
                                                    "users.edit",
                                                    id
                                                )}
                                                className="flex items-center px-6 py-4 focus:text-indigo focus:outline-none"
                                            >
                                                {email}
                                            </Link>
                                        </td>
                                        <td className="w-px border-t">
                                            <Link
                                                tabIndex="-1"
                                                href={route(
                                                    "users.edit",
                                                    id
                                                )}
                                                className="flex items-center px-4"
                                            >
                                                <Icon
                                                    name="cheveron-right"
                                                    className="block w-6 h-6 text-gray-400 fill-current"
                                                />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            }
                        )}
                        {organization.users?.length === 0 && (
                            <tr>
                                <td className="px-6 py-4 border-t" colSpan="4">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

Edit.layout = (page) => <Layout children={page} />;

export default Edit;
