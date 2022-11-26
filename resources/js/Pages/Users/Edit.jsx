import { Inertia } from "@inertiajs/inertia";
import { Link, usePage, useForm, Head } from "@inertiajs/inertia-react";
import Layout from "@/Shared/Layout";
import DeleteButton from "@/Shared/DeleteButton";
import LoadingButton from "@/Shared/LoadingButton";
import TextInput from "@/Shared/TextInput";
import SelectInput from "@/Shared/SelectInput";
import FileInput from "@/Shared/FileInput";
import TrashedMessage from "@/Shared/TrashedMessage";
import InputLabel from "@/Shared/InputLabel";
import InputError from "@/Shared/InputError";

const Edit = () => {
    const { user } = usePage().props;
    const { data, setData, errors, post, processing } = useForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        password: user.password || "",
        owner: user.owner ? "1" : "0" || "0",
        photo: "",

        // NOTE: When working with Laravel PUT/PATCH requests and FormData
        // you SHOULD send POST request and fake the PUT request like this.
        _method: "PUT",
    });

    function handleSubmit(e) {
        e.preventDefault();

        // NOTE: We are using POST method here, not PUT/PACH. See comment above.
        post(route("users.update", user.id));
    }

    function destroy() {
        if (confirm("Are you sure you want to delete this user?")) {
            Inertia.delete(route("users.destroy", user.id));
        }
    }

    function restore() {
        if (confirm("Are you sure you want to restore this user?")) {
            Inertia.put(route("users.restore", user.id));
        }
    }

    return (
        <>
            <Head title={`${data.first_name} ${data.last_name}`} />
            <div className="flex justify-start max-w-lg mb-8">
                <h1 className="text-3xl font-bold">
                    <Link
                        href={route("users")}
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
            {user.deleted_at && (
                <TrashedMessage onRestore={restore}>
                    This user has been deleted.
                </TrashedMessage>
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
                        {!user.deleted_at && (
                            <DeleteButton onDelete={destroy}>
                                Delete User
                            </DeleteButton>
                        )}
                        <LoadingButton
                            loading={processing}
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
