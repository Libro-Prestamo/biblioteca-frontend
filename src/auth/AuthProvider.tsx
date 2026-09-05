import { PublicClientApplication } from "@azure/msal-browser";
import type { PropsWithChildren } from "react";
import { msalConfig } from "./msalConfig";
import { MsalProvider } from "@azure/msal-react";

const msalInstance = new PublicClientApplication(msalConfig);

export function AuthProvider ({ children} : PropsWithChildren) {
    return <MsalProvider instance={msalInstance}>{children}</MsalProvider>
}