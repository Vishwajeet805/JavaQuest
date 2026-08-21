"use client";
import type { AuthUserDto } from "@javaquets/shared";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as auth from "@/services/auth";
import { ApiError } from "@/lib/api";
type State = { user: AuthUserDto | null; loading: boolean; login: typeof auth.login; signup: typeof auth.signup; logout: () => Promise<void> };
const Context = createContext<State | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) { const [user,setUser]=useState<AuthUserDto|null>(null); const [loading,setLoading]=useState(true); useEffect(()=>{auth.getMe().then(r=>setUser(r.user)).catch((e:unknown)=>{if(!(e instanceof ApiError&&e.status===401))console.error(e);}).finally(()=>setLoading(false));},[]); const login=useCallback(async(input:{email:string;password:string})=>{const r=await auth.login(input);setUser(r.user);return r;},[]); const signup=useCallback(async(input:{email:string;password:string;displayName?:string})=>{const r=await auth.signup(input);setUser(r.user);return r;},[]); const logout=useCallback(async()=>{await auth.logout();setUser(null);},[]); const value=useMemo(()=>({user,loading,login,signup,logout}),[user,loading,login,signup,logout]); return <Context.Provider value={value}>{children}</Context.Provider>; }
export function useAuth(){const value=useContext(Context);if(!value)throw new Error("Missing AuthProvider");return value;}
