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

export { getSigner, filesize };

