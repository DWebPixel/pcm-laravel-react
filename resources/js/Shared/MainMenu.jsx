import React from "react";
import MainMenuItem from "@/Shared/MainMenuItem";
import { usePage } from "@inertiajs/react";

export default ({ className, onClick }) => {
    const { auth } = usePage().props;
    return (
        <div className={className} onClick={onClick}>
            { auth.user.role == 'Admin' && 
                ( <>
                    <MainMenuItem text="Dashboard" link="dashboard" icon="dashboard" />
                    <MainMenuItem
                        text="Organizations"
                        link="organizations.index"
                        icon="office"
                    />
                    <MainMenuItem text="Patients" link="patients.index" icon="users" />
                    <MainMenuItem text="Reports" link="reports" icon="printer" />
                </>
                )
            }

            { auth.user.role == 'Doctor' && 
                ( <>
                    <MainMenuItem text="Dashboard" link="dashboard" icon="dashboard" />
                    <MainMenuItem text="Connected Patients" link="doctor.connected-patients" icon="users" />
                    <MainMenuItem text="Request Consent" link="doctor.request-consent" icon="printer" />
                </>
                )
            }
        </div>
    );
};
