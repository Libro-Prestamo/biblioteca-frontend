import { useAccount, useIsAuthenticated, useMsal } from "@azure/msal-react";
import { apiScopes, loginRequest } from "./msalConfig";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

export function useAuth() {

    const { instance, accounts} = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const account = useAccount(accounts[0] ?? null);

    async function login() {
        await instance.loginRedirect(loginRequest);
    }

    async function logout() {
        await instance.logoutRedirect({
            account : account ?? undefined,
        })
    }

    async function getAccessToken() : Promise<string> {
        const activeAccount = account ?? accounts[0];

        if (!activeAccount) {
            throw new Error('No hay una cuenta autenticada');
        }

        try {
            const result = await instance.acquireTokenSilent({
                account : activeAccount,
                scopes : apiScopes
            });
            return result.accessToken;
        } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
                await instance.acquireTokenRedirect({
                    account : activeAccount,
                    scopes : apiScopes,
                });
            }
            throw error;
            
        }
    }

    async function tieneRolAdmin() : Promise<boolean> {
        try {
            const token = await getAccessToken();
            const payloadBase64 = token.split(".")[1];
            const payloadJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
            const payload = JSON.parse(payloadJson) as { roles? : string[] };
            return payload.roles?.includes("ADMIN") ?? false;
        } catch {
            return false;
        }
    }



    return { isAuthenticated, account, login, logout, getAccessToken, tieneRolAdmin}
}