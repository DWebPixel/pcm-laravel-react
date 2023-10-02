import Layout from "@/Shared/Layout";
import { Head, usePage } from "@inertiajs/react";

const HealthRecords = () => {
    const {user} = usePage().props;

    return (
        <>
            <Head title="Connected Patients" />
            <h1 className="mb-8 text-3xl font-bold">Health Records</h1>
        </>
    );
};

HealthRecords.layout = (page) => <Layout children={page} />;

export default HealthRecords;
