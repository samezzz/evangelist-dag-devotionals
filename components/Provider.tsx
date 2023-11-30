'use client';

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

interface Props {
    children: ReactNode;
    session: Session | null
}


const Provider = ({children, session}: Props) => {
    return <SessionProvider session={session}>
        {children}
    </SessionProvider>
};

export default Provider;