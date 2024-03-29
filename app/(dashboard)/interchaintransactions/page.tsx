/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { avax_native1 } from "@/utils/constant";
import nativeABI from "../../../abi/native.json";
import interABI from "../../../abi/inter.json";
import { polygon_native1 } from "@/utils/constant";
import { useAccount, useNetwork } from "wagmi";
import { bsc_native1 } from "@/utils/constant";

export default function TransactionPage() {
  const [state, setState] = useState(true);
  const { address } = useAccount();
  const [data, setData] = useState([]);
  const { chain } = useNetwork();
  const network = chain?.network;

  const native =
    network === "maticmum"
      ? polygon_native1
      : network === "avalanche-fuji"
      ? avax_native1
      : bsc_native1;

  const createReadContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.BrowserProvider(ethereum);
    const payContract = new ethers.Contract(native, interABI.abi, provider);
    return payContract;
  };

  const getOrders = async () => {
    const contract = await createReadContract();
    const data = await contract.getTransactions(address);
    console.log(data);
    setData(data);
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="container ">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">
            Transactions
          </h1>

          {/*  <div className="flex justify-between w-1/5 mb-5">
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
              Native
            </button>
          </div> */}
        </div>
      </div>
      <hr className="my-8" />

      {state ? (
        <section style={{ marginTop: "30px", overflowX: "auto" }} className="">
          <table className="font-heading mx-auto w-98 text-white px-3 table-auto w-full">
            <tbody>
              <tr className="font-heading">
                <th>Id</th>
                <th>Order id</th>
                <th>Amount</th>
                <th>Recipient</th>
                <th>Owner</th>
                <th>Destination Chain</th>
              </tr>
              {data.map((item) => {
                return (
                  <tr key={item.id} className="font-heading py-3">
                    <td className="py-6">{String(item?.id)}</td>
                    <td className="text-center">{String(item?.orderId)}</td>
                    <td className="text-center">
                      {String(Number(item?.amount) / 10 ** 6)} aUSDC
                    </td>
                    <td className="text-center">{item?.recipient}</td>
                    <td className="text-center">{item?.owner}</td>
                    <td className="text-center">{item?.dchain}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      ) : null}

      {state === false ? (
        <section style={{ marginTop: "30px", overflowX: "auto" }} className="">
          <table className="font-heading mx-auto w-98 text-white px-3 table-auto w-full">
            <tbody>
              <tr className="font-heading">
                <th>Id</th>
                <th>Order id</th>
                <th>Amount</th>
                <th>Recipient</th>
                <th>Owner</th>
              </tr>
              {data.map((item) => {
                return (
                  <tr key={item.id} className="font-heading py-3">
                    <td className="py-6">No 1</td>
                    <td>No 2</td>
                    <td>No3</td>
                    <td>No 4</td>
                    <td>No 1</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      ) : null}
    </div>
  );
}
