'use client';
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { ApolloProvider } from "./ApolloProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <ApolloProvider>
                {children}
            </ApolloProvider>
        </Provider>
    );
}