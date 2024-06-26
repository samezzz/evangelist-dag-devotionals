"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { userAuthSchema } from "@/lib/validations/auth";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/Icons";
import { buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";

type FormData = z.infer<typeof userAuthSchema>;

interface Props {
  callBackUrl?: string;
}

export default function LoginAuthForm(props: Props) {
  // const router = useRouter();
  const searchParams = useSearchParams();
  const callBackUrl = searchParams?.get("from") || "/posts";

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [noSuchAccount, setNoSuchAccount] = useState<boolean>(false);

  const { toast } = useToast();

  useEffect(() => {
    const error = searchParams?.get("error");
    error &&
      toast({
        title: "Something went wrong.",
        description: "Your sign in request failed. Please try again.",
        variant: "destructive",
      });
  }, [searchParams, toast]);

  const form = useForm<z.infer<typeof userAuthSchema>>({
    resolver: zodResolver(userAuthSchema),
    defaultValues: {
      email: "",
    },
  });

  async function handleFormSubmit(data: FormData, e: any) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = signIn('resend', { email: data.email, callBackUrl })
      
      if (!res) {
        setIsLoading(false);
			return toast({
				title: "Something went wrong",
        description: "We sent you a login link. Be sure to check your spam too.",
        variant: "destructive"
			});
      } else {
        setIsLoading(false);
        return toast({
          title: "Check your email",
          description: "We sent you a login link. Be sure to check your spam too.",
        })
      }
    } catch (error: any) {
      console.error("Error:", error);
      return toast({
        title: "Something went wrong.",
        description:
          "Your sign in request failed. Please try again.",
          variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-8"
        method="post"
        action="/api/auth/signin"
      >
        <div className="grid gap-2">
          <div className="grid gap-1">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="example@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <button
            type="submit"
            className={cn(buttonVariants())}
            disabled={isLoading || noSuchAccount}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Log In
          </button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={() => {
          setIsGoogleLoading(true);
          signIn("google");
        }}
        disabled={isLoading || isGoogleLoading}
      >
        {isGoogleLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Image
            src="/google.png"
            alt="google"
            width={20}
            height={20}
            className="mx-2"
          />
        )}{" "}
        Google
      </button>
    </Form>
  );
}
