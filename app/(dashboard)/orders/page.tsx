/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { compareDesc } from "date-fns";
import nativeABI from "../../../abi/native.json";
import { ethers } from "ethers";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { polygon_native } from "@/utils/constant";
import { useAccount, useNetwork } from "wagmi";

export default function DashPage() {
  const [state, setState] = useState(true);
  const [data, setData] = useState([]);
  const { address } = useAccount();

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

  const getOrders = async () => {
    const contract = await createReadContract();
    const data = await contract.getOrders(address);
    setData(data);
  };

  useEffect(() => {
    getOrders();
  }, []);

  const allPosts = [
    {
      _id: 0,
      published: "2011-10-11",
      image:
        "https://res.cloudinary.com/josh4324/image/upload/v1695643970/vrxhjnw8yxnphecojnde.png",
      title: "Title 1",
      description: "Description 1",
      date: "2011-10-11",
      slug: "slug",
    },
    {
      _id: 1,
      published: "2012-10-11",
      image:
        "https://res.cloudinary.com/josh4324/image/upload/v1695643970/vrxhjnw8yxnphecojnde.png",
      title: "Title 1",
      description: "Description 1",
      date: "2011-10-11",
      slug: "slug",
    },
    {
      _id: 2,
      published: "2013-10-11",
      image:
        "https://res.cloudinary.com/josh4324/image/upload/v1695643970/vrxhjnw8yxnphecojnde.png",
      title: "Title 1",
      description: "Description 1",
      date: "2011-10-11",
      slug: "slug",
    },
    {
      _id: 3,
      published: "2014-10-11",
      image:
        "https://res.cloudinary.com/josh4324/image/upload/v1695643970/vrxhjnw8yxnphecojnde.png",
      title: "Title 1",
      description: "Description 1",
      date: "2011-10-11",
      slug: "slug",
    },
    {
      _id: 4,
      published: "2015-10-11",
      image:
        "https://res.cloudinary.com/josh4324/image/upload/v1695643970/vrxhjnw8yxnphecojnde.png",
      title: "Title 1",
      description: "Description 1",
      date: "2011-10-11",
      slug: "slug",
    },
    {
      _id: 5,
      published: "2016-10-11",
      image:
        "https://res.cloudinary.com/josh4324/image/upload/v1695643970/vrxhjnw8yxnphecojnde.png",
      title: "Title 1",
      description: "Description 1",
      date: "2011-10-11",
      slug: "slug",
    },
  ];
  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => {
      return compareDesc(new Date(a.date), new Date(b.date));
    });

  return (
    <div className="container ">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">
            Orders
          </h1>
          <p className="text-xl text-muted-foreground">
            Orders created by you.
          </p>

          <div className="flex justify-between w-1/5 mb-5">
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
          </div>
        </div>
      </div>
      <hr className="my-8" />

      {state ? (
        <section>
          <table className="font-heading mx-auto w-98 text-white px-3 table-auto w-full">
            <thead className="font-heading">
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Order Amount</th>
                <th>Total Amount</th>
                <th>Interval for payment (seconds)</th>
                <th>Order Complete Status</th>
                <th>Recipient</th>
                <th>Order Status </th>
                <th>Amount Paid Out</th>
                <th>Edit</th>
                <th>Pause</th>
                <th>Start</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => {
                return (
                  <tr key={item?.id} className="font-heading py-3">
                    <td className="py-3">{String(item?.id)}</td>
                    <td className="text-center">{item?.name}</td>
                    <td className="text-center">
                      {String(Number(item?.order_amount) / 10 ** 18)
                        ? String(Number(item?.order_amount) / 10 ** 18)
                        : null}
                    </td>
                    <td className="text-center">
                      {String(Number(item?.amount) / 10 ** 18)}
                    </td>
                    <td className="text-center">{String(item?.interval)}</td>
                    <td className="text-center">{String(item?.status)}</td>
                    <td className="text-center">{item?.recipient}</td>
                    <td className="text-center">{String(item?.or_status)}</td>
                    <td className="text-center">
                      {String(Number(item?.amountPaid) / 10 ** 18)}
                    </td>
                    <Link href="/orders/native/1">
                      <td className="py-5">Edit</td>
                    </Link>

                    <td>
                      <button>Pause</button>
                    </td>
                    <td>
                      <button>Start</button>
                    </td>
                    <td>
                      <button>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      ) : null}

      {state === false ? (
        <section>
          <table className="font-heading mx-auto w-98 text-white px-3 table-auto w-full">
            <thead className="font-heading">
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Order Amount</th>
                <th>Total Amount</th>
                <th>Interval for payment (seconds)</th>
                <th>Order Complete Status</th>
                <th>Recipient</th>
                <th>Order Status </th>
                <th>Amount Paid Out</th>
                <th>Edit</th>
                <th>Pause</th>
                <th>Start</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((item) => {
                return (
                  <tr key={item.id} className="font-heading py-3">
                    <td className="py-3">No 1</td>
                    <td>No 2</td>
                    <td>No3</td>
                    <td>No 4</td>
                    <td>No 1</td>
                    <td>No 2</td>
                    <td>No 4</td>
                    <td>No 4</td>
                    <td>No 4</td>
                    <Link href="/orders/native/1">
                      <td className="py-5">Edit</td>
                    </Link>

                    <td>
                      <button>Pause</button>
                    </td>
                    <td>
                      <button>Start</button>
                    </td>
                    <td>
                      <button>Delete</button>
                    </td>
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
