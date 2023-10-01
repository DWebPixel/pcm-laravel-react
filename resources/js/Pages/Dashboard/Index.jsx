import Layout from "@/Shared/Layout";
import { Head, usePage } from "@inertiajs/react";

const Dashboard = () => {
    const {user} = usePage().props;

    return (
        <>
            <Head title="Dashboard" />
            <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

            <div className="mb-2 text-lg">
            <span className="font-bold mr-2">Name:</span> <span>{user.first_name + " " + user.last_name} </span>
            </div>
            <div className="mb-2 text-lg">
                <span className="font-bold mr-2">Role:</span> <span>{user.role} </span>
            </div>
            <div className="mb-2 text-lg">
                <span className="font-bold mr-2">Address:</span> <span>{user.address} </span>
            </div>
            <div className="mb-2 text-lg">
                <span className="font-bold mr-2">Blockchain Address:</span> <span>{user.bc_address} </span>
            </div>
        </>
    );
};

Dashboard.layout = (page) => <Layout children={page} />;

export default Dashboard;
