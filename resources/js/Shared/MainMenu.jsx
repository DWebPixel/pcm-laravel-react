import React from "react";
import MainMenuItem from "@/Shared/MainMenuItem";
import { usePage } from "@inertiajs/react";

export default ({ className, onClick }) => {
    const { auth } = usePage().props;
    return (
        <div className={className} onClick={onClick}>
            { true && 
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

            { auth.user.role == 'Patient' && 
                ( <>
                    <MainMenuItem text="Dashboard" link="dashboard" icon="dashboard" />
                    <MainMenuItem text="Connected Doctors" link="patient.connected-doctors" icon="users" />
                    <MainMenuItem text="Consent Requests" link="patient.index-consents" icon="printer" />
                    <MainMenuItem text="Health Records" link="patient.index-health-records" icon="printer" />
                    <MainMenuItem text="Consent Settings" link="patient.consent-settings" icon="printer" />
                </>
                )
            }
        </div>
    );
};
