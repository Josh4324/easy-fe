import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { UserAuthForm } from "@/components/user-auth-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

export const metadata = {
  title: "Pricing",
};

export default function TodoPage() {
  return (
    <section className="container flex flex-col  gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24">
      <div className="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Create Todo
        </h2>

        <form className="mt-5">
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="todo">
                Enter Todo
              </Label>
              <Input
                id="todo"
                placeholder="Enter Todo"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
              />
            </div>
            <button className={` ${cn(buttonVariants())} mt-3 `}>
              Create Todo
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
