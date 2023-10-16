import { ethers } from "ethers";
const getSigner = () => {
    return new Promise((resolve, reject) => {
       
        const onLoad =  async () => {

            if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                try {
                   
                    await window.ethereum.enable();
           
                    resolve(signer);
                } catch (error) {
                    reject(error);
                }
            }            
            else {
                reject("Please install metamask");
            }
        };
        onLoad();
    });
};

const filesize = function(size) {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 +
    ' ' +
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  );
}

const getAccessTypeForBlockchain = (access_type) => {
    const reversedArray = {
        "Read" : 0,
        "Copy" : 1,
        "Write": 2
    };
    return reversedArray[access_type];
}

const getPuporseTypesForBlockchain = (purposes) => {
    const reversedArray = {
        "GeneralPurpose": 0,
        "Education": 1,
        "E-Statistic": 2,
        "E-MedicineDiscovery": 3,
        "MedicalTreatment": 4,
        "M-Cancer": 5,
        "M-Diabetic": 6,
        "M-Education": 7,
        "M-Mental": 8,
        "Insurance": 9,
        "I-EvaluatelnsuranceStatus": 10
    };

    var purposeTypes = [];

    for (const [key, value] of Object.entries(purposes)) {
        if( value ) {
            purposeTypes.push( reversedArray[key] )
        }
      }


    return purposeTypes;
}

export { getSigner, filesize, getAccessTypeForBlockchain, getPuporseTypesForBlockchain };

