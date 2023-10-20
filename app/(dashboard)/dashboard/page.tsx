/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { compareDesc } from "date-fns";
import todoABI from "../../../abi/todo.json";
import { ethers } from "ethers";

import { formatDate } from "@/lib/utils";

export default async function DashPage() {
  const createReadContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.BrowserProvider(ethereum);
    const payContract = new ethers.Contract(
      "0x577336CBadDDe8F312feA34DD0885830d9fBB0b3",
      todoABI.abi,
      provider
    );
    return payContract;
  };

  const getTodos = async () => {
    const contract = await createReadContract();
    const data = await contract.getAllTodos("pending");
    console.log(data);
  };

  useEffect(() => {
    getTodos();
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
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">
            Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            A blog built using Contentlayer. Posts are written in MDX.
          </p>
        </div>
      </div>
      <hr className="my-8" />
      {posts?.length ? (
        <div className="grid gap-10 sm:grid-cols-2">
          {posts.map((post, index) => (
            <article
              key={post._id}
              className="group relative flex flex-col space-y-2"
            >
              {post.image && (
                <Image
                  src={post.image}
                  alt={post.title}
                  width={804}
                  height={452}
                  className="rounded-md border bg-muted transition-colors"
                  priority={index <= 1}
                />
              )}
              <h2 className="text-2xl font-extrabold">{post.title}</h2>
              {post.description && (
                <p className="text-muted-foreground">{post.description}</p>
              )}
              {post.date && (
                <p className="text-sm text-muted-foreground">
                  {formatDate(post.date)}
                </p>
              )}
              <Link href={post.slug} className="absolute inset-0">
                <span className="sr-only">View Article</span>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p>No posts published.</p>
      )}
    </div>
  );
}
