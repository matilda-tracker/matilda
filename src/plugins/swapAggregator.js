// import {isAddress} from '@ethersproject/address';
// import SettingsIcon from '@material-ui/icons/Settings';
// import {useWeb3React} from '@web3-react/core';
// import {Contract} from 'ethers';
// import {useCallback, useEffect, useState} from 'react';
// import Popup from 'reactjs-popup';
// import * as TokenABI from "./abi/HRC20.json";
// import 'reactjs-popup/dist/index.css';
// import axios from 'axios';
// import {commify, parseEther, parseUnits} from '@ethersproject/units';
// import * as MatildaABI from './abi/MatildaSwapper.json';
// import * as HardCap from "./abi/HRC20.json";
//
// export const {library, account, chainId} = useWeb3React();
//
// export const [timestamp, setTimestamp] = useState(0);
// library.getBlock().then((result) => {
//     setTimestamp(result.timestamp);
// });
//
// /* Settings */
// export const [slippageTolerance, setSlippageTolerance] = useState(1);
// export const [multihops, setMultihops] = useState(true);
// export const multihopsDescriptions = {true: "Enabled", false: "Disabled"};
// export const [maxhops, setMaxhops] = useState(2);
// export const [transactionDeadline, setTransactionDeadline] = useState(20);
// export const [recipientAddress, setRecipientAddress] = useState(account);
// /* End Settings */
//
// /* Token From Information */
// export const [tokenAmount, setTokenAmount] = useState(0);
// export const [tokenAddress, setTokenAddress] = useState('');
// export const [tokenBalance, setTokenBalance] = useState(0);
// export const [tokenName, setTokenName] = useState('');
// export const [tokenTicker, setTokenTicker] = useState('');
// export const [tokenDecimals, setTokenDecimals] = useState(0);
// export const [tokenBalanceToUse, setTokenBalanceToUse] = useState(0);
// /* End Token From Information */
//
// /* Token To Information */
// export const [tokenToAddress, setTokenToAddress] = useState('');
// export const [tokenToBalance, setTokenToBalance] = useState(0);
// export const [tokenToName, setTokenToName] = useState('');
// export const [tokenToTicker, setTokenToTicker] = useState('');
// export const [tokenToDecimals, setTokenToDecimals] = useState(0);
// export const [tokenToBalanceToUse, setTokenToBalanceToUse] = useState(0);
// /* End Token To Information */
//
// export const tokenDescription = {"TOKEN_A": tokenTicker, "TOKEN_B": tokenToTicker};
//
// useEffect(() => {
//     setTokenToBalanceToUse(tokenToBalance / (10 ** tokenToDecimals));
//     setTokenBalanceToUse(tokenBalance / (10 ** tokenDecimals));
// }, [tokenToBalance, tokenToDecimals, tokenBalance, tokenDecimals, maxhops, multihops]);
//
// /* Inline Functions */
// export const updateSwapInfo = async (valueToUse, side /* 1=from, 2=to */, where /* 1=fromAmount, 2=fromAddress, 3=null, 4=ToAddress */) => {
//     if (side === 1) {
//         if (where === 1) {
//             setTokenAmount(valueToUse);
//         } else if (where === 2) {
//             setTokenAddress(valueToUse);
//
//             if (isAddress(valueToUse)) {
//                 const contractToUseFrom = new Contract(valueToUse, TokenABI.abi, library.getSigner(account));
//
//                 if (String(valueToUse).toLowerCase() === String('0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a').toLowerCase()) {
//                     setTokenName('ONE');
//                     setTokenTicker("(ONE)");
//                     contractToUseFrom.decimals().then((result) => {
//                         setTokenDecimals(result * 1)
//                     });
//                     library.getBalance(account).then((balance) => {
//                         setTokenBalance(balance)
//                     });
//                 } else {
//                     contractToUseFrom.name().then((result) => {
//                         setTokenName(result)
//                     });
//                     contractToUseFrom.symbol().then((result) => {
//                         setTokenTicker("(" + result + ")")
//                     });
//                     contractToUseFrom.decimals().then((result) => {
//                         setTokenDecimals(result * 1)
//                     });
//                     contractToUseFrom.balanceOf(account).then((result) => {
//                         setTokenBalance(result * 1)
//                     });
//                 }
//             } else {
//                 setTokenName('');
//                 setTokenTicker('');
//                 setTokenDecimals(0);
//                 setTokenBalance(0);
//             }
//         }
//     } else if (side === 2) {
//         if (where === 3) {
//
//         } else if (where === 4) {
//             setTokenToAddress(valueToUse);
//
//             if (isAddress(valueToUse)) {
//                 const contractToUseFrom = new Contract(valueToUse, TokenABI.abi, library.getSigner(account));
//
//                 if (String(valueToUse).toLowerCase() === String('0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a').toLowerCase()) {
//                     setTokenToName('ONE');
//                     setTokenToTicker("(ONE)");
//                     contractToUseFrom.decimals().then((result) => {
//                         setTokenToDecimals(result * 1)
//                     });
//                     library.getBalance(account).then((balance) => {
//                         setTokenToBalance(balance)
//                     });
//                 } else {
//                     contractToUseFrom.name().then((result) => {
//                         setTokenToName(result)
//                     });
//                     contractToUseFrom.symbol().then((result) => {
//                         setTokenToTicker("(" + result + ")")
//                     });
//                     contractToUseFrom.decimals().then((result) => {
//                         setTokenToDecimals(result * 1)
//                     });
//                     contractToUseFrom.balanceOf(account).then((result) => {
//                         setTokenToBalance(result * 1)
//                     });
//                 }
//             } else {
//                 setTokenToName('');
//                 setTokenToTicker('');
//                 setTokenToDecimals(0);
//                 setTokenToBalance(0);
//             }
//         }
//     }
// }
//
// export const setHopsAllowed = () => {
//     const maxHopsInfo = [!multihops];
//     setMultihops(maxHopsInfo[0]);
//     if (maxHopsInfo[0] === false) {
//         setMaxhops(1);
//     } else if (maxHopsInfo[0] === true) {
//         setMaxhops(2);
//     }
// }
//
// export const setPercentage = (toWhat) => {
//     setTokenAmount((tokenBalance * toWhat) / (10 ** tokenDecimals));
// }
//
// export const swapDirection = () => {
//     setDirection(!direction);
//     const tokenFromInformation = [tokenAmount, tokenAddress, tokenBalance, tokenName, tokenTicker, tokenDecimals];
//     const tokenToInformation = [tokenToAddress, tokenToBalance, tokenToName, tokenToTicker, tokenToDecimals];
//
//     /* Update From Info */
//     setTokenAddress(tokenToInformation[0]);
//     setTokenBalance(tokenToInformation[1]);
//     setTokenName(tokenToInformation[2]);
//     setTokenTicker(tokenToInformation[3]);
//     setTokenDecimals(tokenToInformation[4]);
//
//     /* Update To Info */
//     setTokenToAddress(tokenFromInformation[1]);
//     setTokenToBalance(tokenFromInformation[2]);
//     setTokenToName(tokenFromInformation[3]);
//     setTokenToTicker(tokenFromInformation[4]);
//     setTokenToDecimals(tokenFromInformation[5]);
// }
//
// export const [direction, setDirection] = useState(false);
// export const [addSend, setAddSend] = useState(false);
// export const [checkedAround, setCheckedAround] = useState(false);
// export const [results, setResults] = useState([]);
// export const getSwapInformation = useCallback(() => {
//     if (!checkedAround) setCheckedAround(true);
//
//     if (isAddress(tokenAddress) && isAddress(tokenToAddress) && tokenAmount > 0) {
//         axios.get('/api/uniswap-aggregator/', {
//             params: {
//                 from: tokenAddress,
//                 to: tokenToAddress,
//                 in: tokenAmount,
//                 hops: maxhops
//             },
//             dataType: 'jsonp',
//         }).then((result) => {
//             setResults(result.data.result);
//         }).catch((e) => {
//             console.log(e);
//         })
//     }
// }, [checkedAround, maxhops, tokenAddress, tokenToAddress, tokenAmount]);
//
// useEffect(() => {
//     getSwapInformation();
// }, [tokenAddress, tokenToAddress, tokenAmount, slippageTolerance, multihops, maxhops, transactionDeadline, recipientAddress, getSwapInformation]);
//
// export const [approvalReturn, setApprovalReturn] = useState({});
// export const [approved, setApproved] = useState({});
// export const approveSwap = (eye, routerAddress, tokenFromAddress, tokenFromDecimals, tokenFromAmount) => {
//     const approvalContract = new Contract(tokenFromAddress, HardCap.abi, library.getSigner(account));
//     var numOfTokens = parseUnits(String(tokenFromAmount), tokenFromDecimals);
//
//     setApproved({});
//     setApprovalReturn({});
//     setSwapped({});
//     setSwappedReturn({});
//
//     approvalContract.approve(NETWORK_TJ_DATA[chainId].matilda_swap_contract, numOfTokens, {gasPrice: NETWORK_TJ_DATA[chainId].imposedGasFee}).then((result) => {
//         result.wait(1).then((receipt) => {
//             const updatedValue = {};
//             updatedValue[eye] = true;
//             setApproved({...approved, ...updatedValue});
//         });
//     }).catch((e) => {
//         const updatedValue = {};
//         if (typeof e.data !== 'undefined') {
//             updatedValue[eye] = e.data.message;
//         } else {
//             updatedValue[eye] = e.message;
//         }
//         setApprovalReturn({...approvalReturn, ...updatedValue});
//     })
// }
//
// export const [swappedReturn, setSwappedReturn] = useState({});
// export const [swapped, setSwapped] = useState({});
// export const performSwap = (eye, routerAddress, amountIn, amountOut, path, to, deadline) => {
//     const contractToUse = new Contract(NETWORK_TJ_DATA[chainId].matilda_swap_contract, MatildaABI.abi, library.getSigner(account));
//
//     setSwapped({});
//     setSwappedReturn({});
//
//     const amountInConverted = parseUnits(String(amountIn), tokenDecimals);
//     const amountOutConverted = parseUnits(String(amountOut), tokenToDecimals);
//     const pathToUse = [];
//     for (var i = 0; i < path.length; i++) {
//         pathToUse.push(path[i].address);
//     }
//
//     if (!isAddress(to)) {
//         to = account;
//     }
//
//     if (String(pathToUse[0]).toLowerCase() === String('0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a').toLowerCase()) {
//         contractToUse.performSingleSwap(routerAddress, amountInConverted, amountOutConverted, pathToUse, to, deadline, {
//             from: account,
//             value: parseEther(String(amountIn))
//         }).then((result) => {
//             result.wait(1).then((receipt) => {
//                 console.log(receipt);
//                 const updatedValue = {};
//                 updatedValue[eye] = true;
//                 setSwapped({...swapped, ...updatedValue});
//             });
//         }).catch((e) => {
//             const updatedValue = {};
//             if (typeof e.data !== 'undefined') {
//                 updatedValue[eye] = e.data.message;
//             } else {
//                 updatedValue[eye] = e.message;
//             }
//             setSwappedReturn({...swappedReturn, ...updatedValue});
//         });
//     } else {
//         contractToUse.performSingleSwap(routerAddress, amountInConverted, amountOutConverted, pathToUse, to, deadline).then((result) => {
//             result.wait(1).then((receipt) => {
//                 console.log(receipt);
//                 const updatedValue = {};
//                 updatedValue[eye] = true;
//                 setSwapped({...swapped, ...updatedValue});
//             });
//         }).catch((e) => {
//             const updatedValue = {};
//             if (typeof e.data !== 'undefined') {
//                 updatedValue[eye] = e.data.message;
//             } else {
//                 updatedValue[eye] = e.message;
//             }
//             setSwappedReturn({...swappedReturn, ...updatedValue});
//         });
//     }
// }
