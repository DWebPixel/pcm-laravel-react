import { Link, useForm, Head, usePage } from "@inertiajs/react";
import Layout from "@/Shared/Layout";
import LoadingButton from "@/Shared/LoadingButton";
import TextInput from "@/Shared/TextInput";
import SelectInput from "@/Shared/SelectInput";
import InputLabel from "@/Shared/InputLabel";
import InputError from "@/Shared//InputError";
import { useEffect, useState } from "react";

const Create = () => {
    const { organization, roles, users } = usePage().props;
    const { data, setData, errors, post, processing } = useForm({
        user_id: users[0]?.id,
        role: roles[0]?.role,
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route("organizations.store_user", organization));
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
                <span className="font-medium text-indigo-600"> /</span> Add User
            </h1>
            <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap p-8 -mb-8 -mr-6">
                        <div className="w-full pb-7 pr-6 lg:w-1/2">
                            <InputLabel forInput="user_id" value="User:" />
                            <SelectInput
                                name="user_id"
                                value={data.user_id}
                                onChange={(e) =>
                                    setData("user_id", e.target.value)
                                }
                            >
                                { users.map( ( { id, name}) => {
                                    return (<option value={id} key={id}>{name}</option>)
                                }) }
                            </SelectInput>
                            <InputError message={errors.user_id} />
                        </div>

                        <div className="w-full pb-7 pr-6 lg:w-1/2">
                            <InputLabel forInput="role" value="Role:" />
                            <SelectInput
                                name="role"
                                value={data.role}
                                onChange={(e) =>
                                    setData("role", e.target.value)
                                }
                            >
                                { 
                                roles.map( ( {role, label} ) => {
                                    return (<option value={role} key={role}>{label}</option>)
                                }) }
                            </SelectInput>
                            <InputError message={errors.role} />
                        </div>
                    </div>
                    <div className="flex items-center justify-end px-8 py-4 bg-gray-100 border-t border-gray-200">
                        <LoadingButton
                            loading={processing}
                            type="submit"
                            className="btn-indigo"
                        >
                            Add User
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
