import { Link, usePage, Head } from "@inertiajs/react";
import Layout from "@/Shared/Layout";
import Icon from "@/Shared/Icon";
import AnchorLink from "@/Shared/AnchorLink";

const Index = () => {
    const { consentsSettings } = usePage().props;
    return (
        <>
            <Head title="Consent Settings" />
            <h1 className="mb-8 text-3xl font-bold">Consent Settings</h1>
            <div className="flex items-center justify-between mb-6">
                <AnchorLink
                    className="btn-indigo focus:outline-none"
                    href={route("patient.consent-settings.create")}
                    style="btn"
                >
                    <span>Create</span>
                    <span className="hidden md:inline"> Setting</span>
                </AnchorLink>
            </div>
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="w-full whitespace-nowrap">
                    <thead>
                        <tr className="font-bold text-left">
                            <th className="px-6 pt-5 pb-4">ID</th>
                            <th className="px-6 pt-5 pb-4">Role</th>
                            <th className="px-6 pt-5 pb-4">Access Type</th>
                            <th className="px-6 pt-5 pb-4">Purpose</th>
                            <th className="px-6 pt-5 pb-4" colSpan="2">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {consentsSettings.map(
                            ({ id, role, access_type, purpose }) => {
                                return (
                                    <tr
                                        key={id}
                                        className="hover:bg-gray-100 focus-within:bg-gray-100"
                                    >
                                        <td className="border-t">
                                            <Link
                                                href={route("patient.consent-settings.edit", id)}
                                                className="flex items-center px-6 py-4 focus:text-indigo-700 focus:outline-none"
                                            >
                                                {id}
                                            </Link>
                                        </td>
                                        <td className="border-t">
                                            <Link
                                                href={route("patient.consent-settings.edit", id)}
                                                className="flex items-center px-6 py-4 focus:text-indigo-700 focus:outline-none"
                                            >
                                                {role}
                                                {/* {deleted_at && (
                                                    <Icon
                                                        name="trash"
                                                        className="flex-shrink-0 w-3 h-3 ml-2 text-gray-400 fill-current"
                                                    />
                                                )} */}
                                            </Link>
                                        </td>
                                        <td className="border-t">
                                            <Link
                                                href={route("patient.consent-settings.edit", id)}
                                                className="flex items-center px-6 py-4 focus:text-indigo-700 focus:outline-none"
                                            >
                                                {access_type}
                                            </Link>
                                        </td>
                                        <td className="border-t">
                                            <Link
                                                tabIndex="-1"
                                                href={route("patient.consent-settings.edit", id)}
                                                className="px-6 py-4 focus:text-indigo focus:outline-none"
                                            >
                                                {purpose.map((item, index) => <p key={index}>{item}</p>)}
                                            </Link>
                                        </td>
                                        <td className="w-px border-t">
                                            <Link
                                                tabIndex="-1"
                                                href={route("patient.consent-settings.edit", id)}
                                                className="flex items-center px-4 focus:outline-none"
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
                        {consentsSettings.length === 0 && (
                            <tr>
                                <td className="px-6 py-4 border-t" colSpan="5">
                                    No consent settings found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

Index.layout = (page) => <Layout title="Consent Settings" children={page} />;

export default Index;
