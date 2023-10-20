/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useAccount, useNetwork } from "wagmi";
import { useParams } from "next/navigation";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import nativeABI from "../../../../../abi/native.json";
import { polygon_native } from "@/utils/constant";

export default function OrderPage() {
  const { chain } = useNetwork();
  const params = useParams();
  const id = params.id;

  const network = chain?.network;
  const [data, setData] = useState({});
  const [state, setState] = useState(true);
  const [order, setOrder] = useState(0);
  const [interval, setInterval] = useState(0);

  const dolpRef = useRef();

  const createReadContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.BrowserProvider(ethereum);
    const payContract = new ethers.Contract(
      polygon_native,
      nativeABI.abi,
      provider
    );
    return payContract;
  };

  const createWriteContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const payContract = new ethers.Contract(
      polygon_native,
      nativeABI.abi,
      signer
    );
    return payContract;
  };

  const getOrder = async () => {
    const contract = await createReadContract();
    const data = await contract.getOrder(id);
    setData(data);
    setOrder(String(Number(data?.order_amount) / 10 ** 18));
    setInterval(String(data?.interval));
  };

  const editOrder = async (evt) => {
    evt.preventDefault();
    const contract = await createWriteContract();

    const id2 = toast.loading("Transaction in progress..");

    const today = Math.floor(new Date().getTime() / 1000);

    const dolp = Math.floor(new Date(dolpRef.current.value).getTime() / 1000);
    const order_amount = ethers.parseEther(order);

    const lp = dolp - today;

    try {
      const tx = await contract.editOrder(id, order_amount, lp, interval);

      await tx.wait();
      window.location.href = "/orders";

      toast.update(id2, {
        render: "Transaction successfull, Order has been updated",
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

  useEffect(() => {
    getOrder();
  }, []);

  return (
    <section className="container flex flex-col  gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24">
      <div className="flex justify-between w-3/12 mb-5">
        <button
          onClick={() => setState(false)}
          className={` ${cn(buttonVariants())} mt-3 `}
        >
          ERC20
        </button>
        <button
          onClick={() => setState(true)}
          className={` ${cn(buttonVariants())} mt-3 `}
        >
          Matic
        </button>
      </div>
      {state ? (
        <div className="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-3xl">
            Edit Order ({network?.slice(0, 5)})
          </h2>

          <form onSubmit={editOrder} className="mt-5">
            <div className="grid gap-2">
              <div className="grid gap-1">
                <label>Enter Order name</label>
                <input
                  type="text"
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  value={data?.name}
                  placeholder="Enter Order Name"
                />
              </div>
              <div className="grid gap-1">
                <label>Enter Order amount</label>
                <input
                  type="text"
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  placeholder="Enter Order Amount"
                  value={order}
                  onChange={(evt) => setOrder(evt.target.value)}
                />
              </div>

              <div className="grid gap-1">
                <label>Enter Date of Last Repayment</label>
                <input
                  type="datetime-local"
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  placeholder="Enter date of last payment"
                  ref={dolpRef}
                />
              </div>
              <div className="grid gap-1">
                <label>Enter Payment Interval (seconds)</label>
                <input
                  type="text"
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  placeholder="Enter Interval duration (seconds)"
                  value={interval}
                  onChange={(evt) => setInterval(evt.target.value)}
                />
              </div>

              <button className={` ${cn(buttonVariants())} mt-3 `}>
                Edit Order
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {state === false ? (
        <div className="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-3xl">
            Create Order (ERC20)
          </h2>

          <form className="mt-5">
            <div className="grid gap-2">
              <div className="grid gap-1">
                <input
                  type="text"
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  placeholder="Enter Order Name"
                />
              </div>
              <div className="grid gap-1">
                <input
                  type="text"
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  placeholder="Enter Total Order Amount"
                />
              </div>
              <div className="grid gap-1">
                <input
                  type="text"
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  placeholder="Enter Order Amount"
                />
              </div>
              <div className="grid gap-1">
                <input
                  type="datetime-local"
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  placeholder="Enter date of first payment"
                />
              </div>
              <div className="grid gap-1">
                <input
                  type="datetime-local"
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  placeholder="Enter date of last payment"
                />
              </div>
              <div className="grid gap-1">
                <input
                  type="text"
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  placeholder="Enter Interval duration (seconds)"
                />
              </div>
              <div className="grid gap-1">
                <input
                  type="text"
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  placeholder="Enter recipient address"
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
