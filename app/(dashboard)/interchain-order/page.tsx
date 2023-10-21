/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useAccount, useNetwork } from "wagmi";
import nativeABI from "../../../abi/native.json";
import interABI from "../../../abi/inter.json";
import { ethers } from "ethers";
import { polygon_native } from "@/utils/constant";
import { avax_native } from "@/utils/constant";
import { bsc_native } from "@/utils/constant";
import { toast } from "react-toastify";
import { erc20ABI } from "wagmi";
import {
  AxelarQueryAPI,
  Environment,
  EvmChain,
  GasToken,
} from "@axelar-network/axelarjs-sdk";
import {
  bnb_ausdc,
  polygon_ausdc,
  avalanche_ausdc,
  bsc_native1,
  polygon_native1,
  avax_native1,
} from "../../../utils/constant";

export default function OrderPage() {
  const { chain } = useNetwork();
  const network = chain?.network;
  const [state, setState] = useState(true);
  const [gas, setGasFee] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(0);
  const { address } = useAccount();

  const api = new AxelarQueryAPI({ environment: Environment.TESTNET });

  const caddress =
    network === "bsc-testnet"
      ? bsc_native1
      : network === "maticmum"
      ? polygon_native1
      : network === "avalanche-fuji"
      ? avax_native1
      : "";

  const native =
    network === "maticmum"
      ? polygon_native1
      : network === "avalanche-fuji"
      ? avax_native1
      : bsc_native1;

  const createReadContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.BrowserProvider(ethereum);
    const payContract = new ethers.Contract(native, nativeABI.abi, provider);
    return payContract;
  };

  const createUSDContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();

    const caddress_ausdc =
      network === "bsc-testnet"
        ? bnb_ausdc
        : network === "maticmum"
        ? polygon_ausdc
        : network === "avalanche-fuji"
        ? avalanche_ausdc
        : "";

    const usdcContract = new ethers.Contract(caddress_ausdc, erc20ABI, signer);
    return usdcContract;
  };

  const approveAusdc = async (evt) => {
    evt.preventDefault();
    const contract = await createUSDContract();
    const amount = ethers.parseUnits(totalRef.current.value, 6);

    const id = toast.loading("Transaction in progress..");

    try {
      const tx = await contract.approve(caddress, amount);
      await tx.wait();
      toast.update(id, {
        render: "Approval successfull",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
      allowanceCheck();
      const allowance = await contract.allowance(address, caddress);
      setAllowance(Number(allowance) / 10 ** 6);
    } catch (error) {
      console.log(error);
      toast.update(id, {
        render: `${error.reason}`,
        type: "error",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
    }
  };

  const createWriteContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();

    const payContract = new ethers.Contract(native, interABI.abi, signer);
    return payContract;
  };

  const calculateGas = async (chainT) => {
    // Calculate how much gas to pay to Axelar to execute the transaction at the destination chain
    const gasFee = await api.estimateGasFee(
      network === "bsc-testnet"
        ? EvmChain.BNBCHAIN
        : network === "maticmum"
        ? EvmChain.POLYGON
        : network === "avalanche-fuji"
        ? EvmChain.AVALANCHE
        : network === "celo-alfajores"
        ? EvmChain.CELO
        : "",
      chainT === "Binance"
        ? EvmChain.BNBCHAIN
        : chainT === "Polygon"
        ? EvmChain.POLYGON
        : chainT === "Avalanche"
        ? EvmChain.AVALANCHE
        : chainT === "Celo"
        ? EvmChain.CELO
        : "",
      network === "bsc-testnet"
        ? GasToken.BNBCHAIN
        : network === "maticmum"
        ? GasToken.MATIC
        : network === "avalanche-fuji"
        ? GasToken.AVAX
        : network === "celo-alfajores"
        ? GasToken.CELO
        : "",
      700000,
      2
    );

    setGasFee(gasFee);
  };

  const allowanceCheck = async () => {
    const contract = await createUSDContract();
    if (caddress === "") {
      return toast.error("Please connect to a supported chain");
    }
    const amount = await contract.allowance(address, caddress);
    const balance = await contract.balanceOf(address);
    //setBalance(balance / 10 ** 6);
    setAllowance(Number(amount) / 10 ** 6);
  };

  const nameRef = useRef();
  const totalRef = useRef();
  const amountRef = useRef();
  const dofpRef = useRef();
  const dolpRef = useRef();
  const intervalRef = useRef();
  const recipientRef = useRef();
  const chainRef = useRef();

  const createOrder = async (evt) => {
    evt.preventDefault();

    const contract = await createWriteContract();

    const today = Math.floor(new Date().getTime() / 1000);
    const dofp = Math.floor(new Date(dofpRef.current.value).getTime() / 1000);
    const dolp = Math.floor(new Date(dolpRef.current.value).getTime() / 1000);
    const total_amount = ethers.parseUnits(totalRef.current.value, 6);
    const order_amount = ethers.parseUnits(amountRef.current.value, 6);

    const fp = dofp - today;
    const lp = dolp - today;

    if (lp < 0) {
      return toast.error("You cannot enter past date");
    }

    if (fp < 0) {
      return toast.error("You cannot enter past date");
    }

    const rate = Math.round(Number(total_amount) / Number(order_amount));

    const gasF = 0.3 * rate;

    console.log(gasF);

    const chainT = chainRef.current.value;

    const daddress =
      chainT === "Binance"
        ? bsc_native1
        : chainT === "Polygon"
        ? polygon_native1
        : chainT === "Avalanche"
        ? avax_native1
        : "";

    const id = toast.loading("Transaction in progress..");

    try {
      const tx = await contract.createOrderInterChain(
        [nameRef.current.value, chainT, daddress, "aUSDC"],
        [total_amount, order_amount, fp, lp, Number(intervalRef.current.value)],
        recipientRef.current.value,
        {
          value: ethers.parseEther(String(gasF)),
        }
      );

      await tx.wait();
      window.location.href = "/interchainorders";

      toast.update(id, {
        render:
          "Transaction successfull, Payment will start on date of first payment",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
    } catch (error) {
      console.log(error);
      toast.update(id, {
        render: `${error.reason}`,
        type: "error",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
    }
  };

  return (
    <section className="container flex flex-col  gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24">
      {state ? (
        <div className="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-3xl">
            Create Interchain Order
          </h2>

          <form onSubmit={createOrder} className="mt-5">
            <div className="grid gap-2">
              <div className="grid gap-1 mb-3">
                <label>Enter Order Name</label>
                <input
                  type="text"
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  ref={nameRef}
                  placeholder="Enter Order Name"
                  required
                />
              </div>
              <div className="grid gap-1 mb-3">
                <label>Enter Total Order Amount</label>
                <input
                  type="text"
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  ref={totalRef}
                  onChange={() => setCurrentAmount(totalRef.current.value)}
                  placeholder="Enter Total Order Amount"
                  required
                />
              </div>
              <div className="grid gap-1 mb-3">
                <label>Enter Order Amount</label>
                <input
                  type="text"
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  placeholder="Enter Order Amount"
                  ref={amountRef}
                  required
                />
              </div>
              <div className="grid gap-1 mb-3">
                <label>Enter Date of First Payment</label>
                <input
                  type="datetime-local"
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  ref={dofpRef}
                  placeholder="Enter date of first payment"
                  required
                />
              </div>
              <div className="grid gap-1 mb-3">
                <label>Enter Date of Last Payment</label>
                <input
                  type="datetime-local"
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  placeholder="Enter date of last payment"
                  ref={dolpRef}
                  required
                />
              </div>
              <div className="grid gap-1 mb-3">
                <label>Enter Payment Interval (seconds)</label>
                <input
                  type="text"
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  ref={intervalRef}
                  placeholder="Enter Interval duration (seconds)"
                  required
                />
              </div>
              <select
                ref={chainRef}
                onChange={() => calculateGas(chainRef.current.value)}
                className={cn(
                  "flex h-9 w-full rounded-md mb-3 border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                )}
              >
                <option>Select Destination Chain</option>
                <option> Polygon </option>
                <option>Avalanche</option>
                <option>Binance</option>
              </select>
              <div className="grid gap-1">
                <label>Enter Recipient Address</label>
                <input
                  type="text"
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  ref={recipientRef}
                  placeholder="Enter recipient address"
                  required
                />
              </div>

              {allowance >= currentAmount ? (
                <button
                  type="button"
                  onClick={createOrder}
                  className={` ${cn(buttonVariants())} mt-3 `}
                >
                  Create Order
                </button>
              ) : (
                <button
                  type="button"
                  onClick={approveAusdc}
                  className={` ${cn(buttonVariants())} mt-3 `}
                >
                  Approve
                </button>
              )}
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
