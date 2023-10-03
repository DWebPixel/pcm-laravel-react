import { Link, useForm, Head, usePage } from "@inertiajs/react";
import Layout from "@/Shared/Layout";
import LoadingButton from "@/Shared/LoadingButton";
import TextInput from "@/Shared/TextInput";
import SelectInput from "@/Shared/SelectInput";
import FileInput from "@/Shared/FileInput";
import InputLabel from "@/Shared/InputLabel";
import InputError from "@/Shared//InputError";
import Checkbox from "@/Shared/Checkbox";

const CreateHealthRecord = () => {
    const { patient, granted_purpose, consent } = usePage().props;

    const { data, setData, errors, post, processing, reset} = useForm({
        diagnosis: "",
        prescription: "",
        date_of_record: "",
        uploadedFiles: [{
            name: "",
            type: "PROM",
            file: ""
        }],
        purpose: {
            "GeneralPurpose": false,
            "Education": false,
            "E-Statistic": false,
            "E-MedicineDiscovery": false,
            "MedicalTreatment": false,
            "M-Cancer": false,
            "M-Diabetic": false,
            "M-Education": false,
            "M-Mental": false,
            "Insurance": false,
            "I-EvaluatelnsuranceStatus": false
            },  
        },
    );

    function handleSubmit(e) {
        e.preventDefault();
        console.log(data);
        post(route("doctor.store-health-record", [patient.id, consent.id]), {
            onSuccess: () => {
                reset();
            },
        });
    }

    const handleCheckboxChange = (type) => {
        const currentState = data['purpose'][type];
        setData("purpose", {
          ...data["purpose"],
          [type]: !currentState,
        });

        if( type == 'GeneralPurpose' ) {
            setData("purpose", {
                "GeneralPurpose": !currentState,
                "Education": !currentState,
                "E-Statistic": !currentState,
                "E-MedicineDiscovery": !currentState,
                "MedicalTreatment": !currentState,
                "M-Cancer": !currentState,
                "M-Diabetic": !currentState,
                "M-Education": !currentState,
                "M-Mental": !currentState,
                "Insurance": !currentState,
                "I-EvaluatelnsuranceStatus": !currentState
            });
        }

        if( type == 'Education' ) {
            setData("purpose", {
                ...data["purpose"],
                "Education": !currentState,
                "E-Statistic": !currentState,
                "E-MedicineDiscovery": !currentState,
            });
        }

        if( type == 'MedicalTreatment' ) {
            setData("purpose", {
                ...data["purpose"],
                "MedicalTreatment": !currentState,
                "M-Cancer": !currentState,
                "M-Diabetic": !currentState,
                "M-Education": !currentState,
                "M-Mental": !currentState,
            });
        }

        if( type == 'Insurance' ) {
            setData("purpose", {
                ...data["purpose"],
                "Insurance": !currentState,
                "I-EvaluatelnsuranceStatus": !currentState,
            });
        }

      };

    const handleFileInputChange = (index, field, value) => {
        let temp = [...data['uploadedFiles']];
        temp[index][field] = value;
        console.log(temp);
        setData('uploadedFiles', temp)
    };  
      
    function multipleFileUploads() {
        return (
            <>
                { data.uploadedFiles.map((file, index) => {
                    return (
                        <div key={index} className="w-full flex">
                            <div className="w-1/3 pb-7 pr-6">
                                <InputLabel
                                    forInput="file_name"
                                    value="File Name:"
                                />
                                <TextInput
                                    name="file_name"
                                    value={data.uploadedFiles[index].name}
                                    handleChange={(e) =>
                                        handleFileInputChange(index,'name', e.target.value)
                                    }
                                />
                            </div>
                            <div className="w-1/3 pb-7 pr-6">
                                <InputLabel
                                    forInput="file_type"
                                    value="File Type:"
                                />
                                <SelectInput
                                    name="file_type"
                                    value={data.uploadedFiles[index].type}
                                    onChange={(e) =>
                                        handleFileInputChange(index,'type', e.target.value)
                                    }
                                >
                                    <option value="PROM">PROM</option>
                                    <option value="EVENT SUMMARY">EVENT SUMMARY</option>
                                    <option value="DIAGNOSIS">DIAGNOSIS</option>
                                    <option value="PATHOLOGY">PATHOLOGY</option>
                                    <option value="RADIOLOGY">RADIOLOGY</option>
                                    <option value="OTHER">OTHER</option>
                                </SelectInput>
                            </div>
                            <div className="w-1/3">
                                <FileInput
                                    className="w-full pb-8 pr-6 lg:w-1/2"
                                    label="Select File"
                                    name="file"
                                    accept="image/*"
                                    errors={errors.file}
                                    value={data.file}
                                    onChange={(file) => handleFileInputChange(index,'file', file)}
                                />
                            </div>
                        </div>
                    )
                })}
                <button
                    type="button"
                    className="mb-10 px-4 py-1 text-xs font-medium text-white bg-gray-500 rounded-sm focus:outline-none hover:bg-gray-700"
                    onClick={() => {
                        setData('uploadedFiles', [
                            ...data['uploadedFiles'],
                            {
                                name: "",
                                type: "PROM",
                                file: ""
                            }
                        ])
                    }}
                >
                    Add More
                </button>
            </>
        )
    }  
    return (
        <>
            <Head title="Create Health Record" />
            <div>
                <h1 className="mb-8 text-3xl font-bold">
                    {/* <Link
                        href={route("users.index")}
                        className="text-indigo-600 hover:text-indigo-700"
                    >
                        Consents
                    </Link> */}
                    {/* <span className="font-medium text-indigo-600"> /</span>{" "} */}
                    Create Health Record - {patient.name}
                </h1>
            </div>
            <div className="max-w-3xl overflow-hidden bg-white rounded shadow">
                <form name="CreateHealthRecordForm" onSubmit={handleSubmit}>
                    <div className="flex flex-wrap p-8 -mb-8 -mr-6">
                        <div className="w-full pb-7 pr-6">
                            <InputLabel
                                forInput="diagnosis"
                                value="Diagnosis:"
                            />
                             <TextInput
                                name="diagnosis"
                                value={data.diagnosis}
                                handleChange={(e) =>
                                    setData("diagnosis", e.target.value)
                                }
                            />
                            <InputError message={errors.patient_address} />
                        </div>
                        <div className="w-full pb-7 pr-6">
                            <InputLabel
                                forInput="prescription"
                                value="Prescription:"
                            />
                             <TextInput
                                name="prescription"
                                value={data.prescription}
                                handleChange={(e) =>
                                    setData("prescription", e.target.value)
                                }
                            />
                            <InputError message={errors.patient_address} />
                        </div>
                        <div className="w-full pb-7 pr-6">
                            <InputLabel
                                forInput="date_of_record"
                                value="Date Of Record"
                            />
                             <TextInput
                                type="date"
                                name="date_of_record"
                                value={data.date_of_record}
                                handleChange={(e) =>
                                    setData("date_of_record", e.target.value)
                                }
                            />
                            <InputError message={errors.patient_address} />
                        </div>
                        <div className="w-full pb-7 pr-6">
                            <InputLabel
                                forInput="purpose"
                                value="Purpose Type:"
                            />
                            <Checkbox
                                name="general_purpose"
                                value={data.purpose.GeneralPurpose}
                                disabled={!granted_purpose.includes('GeneralPurpose')}
                                handleChange={(e) =>
                                    handleCheckboxChange('GeneralPurpose')
                                }
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                General Purpose
                            </span>
                            <div className="ml-10">
                                <div>
                                    <div>
                                        <Checkbox
                                            name="education"
                                            value={data.purpose.Education}
                                            disabled={!granted_purpose.includes('Education')}
                                            handleChange={(e) =>
                                                handleCheckboxChange('Education')
                                            }
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                            Education
                                        </span>
                                    </div>
                                    <div className="ml-10">
                                        <div>
                                            <Checkbox
                                                name="e-statistic"
                                                value={data.purpose['E-Statistic']}
                                                disabled={!granted_purpose.includes('E-Statistic')}
                                                handleChange={(e) =>
                                                    handleCheckboxChange('E-Statistic')
                                                }
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                            E-Statistic
                                            </span>
                                        </div>
                                        <div>
                                            <Checkbox
                                                name="e-MedicineDiscovery"
                                                value={data.purpose['E-MedicineDiscovery']}
                                                disabled={!granted_purpose.includes('E-MedicineDiscovery')}
                                                handleChange={(e) =>
                                                    handleCheckboxChange('E-MedicineDiscovery')
                                                }
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                            E-MedicineDiscovery
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <Checkbox
                                            name="medicaltreatment"
                                            value={data.purpose.MedicalTreatment}
                                            disabled={!granted_purpose.includes('MedicalTreatment')}
                                            handleChange={(e) =>
                                                handleCheckboxChange('MedicalTreatment')
                                            }
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                        MedicalTreatment
                                        </span>
                                    </div>
                                    <div className="ml-10">
                                        <div>
                                            <Checkbox
                                                name="m-cancer"
                                                value={data.purpose['M-Cancer']}
                                                disabled={!granted_purpose.includes('M-Cancer')}
                                                handleChange={(e) =>
                                                    handleCheckboxChange('M-Cancer')
                                                }
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                            M-Cancer
                                            </span>
                                        </div>
                                        <div>
                                            <Checkbox
                                                name="m-diabetic"
                                                value={data.purpose['M-Diabetic']}
                                                disabled={!granted_purpose.includes('M-Diabetic')}
                                                handleChange={(e) =>
                                                    handleCheckboxChange('M-Diabetic')
                                                }
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                            M-Diabetic
                                            </span>
                                        </div>
                                        <div>
                                            <Checkbox
                                                name="m-education"
                                                value={data.purpose['M-Education']}
                                                disabled={!granted_purpose.includes('M-Education')}
                                                handleChange={(e) =>
                                                    handleCheckboxChange('M-Education')
                                                }
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                            M-Education
                                            </span>
                                        </div>
                                        <div>
                                            <Checkbox
                                                name="m-mental"
                                                value={data.purpose['M-Mental']}
                                                disabled={!granted_purpose.includes('M-Mental')}
                                                handleChange={(e) =>
                                                    handleCheckboxChange('M-Mental')
                                                }
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                            M-Mental
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <Checkbox
                                            name="insurance"
                                            value={data.purpose.Insurance}
                                            disabled={!granted_purpose.includes('Insurance')}
                                            handleChange={(e) =>
                                                handleCheckboxChange('Insurance')
                                            }
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                            Insurance
                                        </span>
                                    </div>
                                    <div className="ml-10">
                                        <div>
                                            <Checkbox
                                                name="i-evaluatelnsurancestatus"
                                                value={data.purpose['I-EvaluatelnsuranceStatus']}
                                                disabled={!granted_purpose.includes('I-EvaluatelnsuranceStatus')}
                                                handleChange={(e) =>
                                                    handleCheckboxChange('I-EvaluatelnsuranceStatus')
                                                }
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                            I-EvaluatelnsuranceStatus
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <InputError message={errors.purpose} />
                        </div>
                        
                        { multipleFileUploads() }                         

                    </div>
                    <div className="flex items-center justify-end px-8 py-4 bg-gray-100 border-t border-gray-200">
                        <LoadingButton
                            loading={processing}
                            type="submit"
                            className="btn-indigo"
                        >
                            Create Health Record
                        </LoadingButton>
                    </div>
                </form>
            </div>
        </>
    );
};

CreateHealthRecord.layout = (page) => <Layout title="Create Health Record" children={page} />;

export default CreateHealthRecord;
