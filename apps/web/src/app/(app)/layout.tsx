"use client";
import {useEffect} from "react";import {useRouter} from "next/navigation";import {AppShell} from "@/components/app-shell";import {useAuth} from "@/features/auth/auth-context";
export default function ProtectedLayout({children}:{children:React.ReactNode}){const{user,loading}=useAuth();const router=useRouter();useEffect(()=>{if(!loading&&!user)router.replace("/login")},[loading,user,router]);if(loading||!user)return <main className="flex min-h-screen items-center justify-center text-slate-400">Preparing your workspace…</main>;return <AppShell>{children}</AppShell>}
