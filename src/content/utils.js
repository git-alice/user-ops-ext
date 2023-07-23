import {ethers} from "ethers"


function getPrettyABI(abi) {
  return abi.replace('function ', '').replaceAll(',', ', ')
}

async function decodeCallData(data) {
  let ABIs = '';
  let funcName = '';
  let funcHex = ''

  console.log('data', data)
  if (data.length > 10) {
    funcHex = data.slice(0, 10);
  } else {
    return {decodedParams: null, abi: null, iface: null}
  }


  if (funcHex === '0x1fad948c') {
    funcName = 'handleOps'
    ABIs = ['function handleOps((address sender,uint256 nonce,bytes initCode,bytes callData,uint256 callGasLimit,uint256 verificationGasLimit,uint256 preVerificationGas,uint256 maxFeePerGas,uint256 maxPriorityFeePerGas,bytes paymasterAndData,bytes signature)[],address)']
  } else {
    let decodedData = await decodeDataForUnknownABI(funcHex)
    if ((decodedData['ok'] === true) && (decodedData['result']['function'][funcHex] != null)) {
      let rawABI = decodedData['result']['function'][funcHex][0]['name']
      funcName = rawABI.split('(')[0]
      ABIs = [`function ${rawABI}`]
    } else {
      return {decodedParams: null, abi: ABIs, iface: null}
    }
  }

  const iface = new ethers.Interface(ABIs);
  let res = iface.decodeFunctionData(funcName, data)
  return {decodedParams: res, abi: ABIs, iface: iface}
}


async function decodeDataForUnknownABI(funcHex) {
  let res = await fetch(`https://api.openchain.xyz/signature-database/v1/lookup?function=${funcHex}&filter=true`);
  return await res.json()
}

export { decodeCallData, decodeDataForUnknownABI, getPrettyABI }
