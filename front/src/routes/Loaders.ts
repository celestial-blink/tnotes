import { defer, redirect } from "react-router-dom";
import type { LoaderFunctionArgs } from "react-router-dom";

import { MySession } from "@/api/Auth";

export const LoaderSession = async ({ request }: LoaderFunctionArgs) => {
    const loaderData = await MySession(request.signal);
    if (loaderData.state === false) return redirect("/auth/login");
    return { loaderData };
}
