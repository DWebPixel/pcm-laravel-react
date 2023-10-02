import Layout from "@/Shared/Layout";
import { Head, usePage } from "@inertiajs/react";

const ConsentSettings = () => {
    const {user} = usePage().props;

    return (
        <>
            <Head title="Connected Patients" />
            <h1 className="mb-8 text-3xl font-bold">Consent Settings</h1>
        </>
    );
};

ConsentSettings.layout = (page) => <Layout children={page} />;

export default ConsentSettings;
