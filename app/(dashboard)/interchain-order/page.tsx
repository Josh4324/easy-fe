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
import { ethers } from "ethers";
import { polygon_native } from "@/utils/constant";
import { avax_native } from "@/utils/constant";
import { bsc_native } from "@/utils/constant";
import { toast } from "react-toastify";

export default function OrderPage() {
  const { chain } = useNetwork();
  const network = chain?.network;
  const [state, setState] = useState(true);
  const native =
    network === "maticmum"
      ? polygon_native
      : network === "avalanche-fuji"
      ? avax_native
      : bsc_native;

  const createWriteContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();

    const payContract = new ethers.Contract(native, nativeABI.abi, signer);
    return payContract;
  };

  const nameRef = useRef();
  const totalRef = useRef();
  const amountRef = useRef();
  const dofpRef = useRef();
  const dolpRef = useRef();
  const intervalRef = useRef();
  const recipientRef = useRef();

  const createOrder = async (evt) => {
    evt.preventDefault();
    const contract = await createWriteContract();

    const today = Math.floor(new Date().getTime() / 1000);
    const dofp = Math.floor(new Date(dofpRef.current.value).getTime() / 1000);
    const dolp = Math.floor(new Date(dolpRef.current.value).getTime() / 1000);
    const total_amount = ethers.parseEther(totalRef.current.value);
    const order_amount = ethers.parseEther(amountRef.current.value);

    const fp = dofp - today;
    const lp = dolp - today;

    if (lp < 0) {
      return toast.error("You cannot enter past date");
    }

    const id = toast.loading("Transaction in progress..");

    try {
      const tx = await contract.createOrder(
        nameRef.current.value,
        total_amount,
        order_amount,
        fp,
        lp,
        intervalRef.current.value,
        recipientRef.current.value,
        {
          value: total_amount,
        }
      );

      await tx.wait();
      window.location.href = "/orders";

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
              <div className="grid gap-1">
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
              <button className={` ${cn(buttonVariants())} mt-3 `}>
                Create Order
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
