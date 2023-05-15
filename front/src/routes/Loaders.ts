import { defer, redirect } from "react-router-dom";
import type { LoaderFunctionArgs } from "react-router-dom";

import { MySession } from "@/api/Auth";
import { filter } from "@api/Note";
import { filter as filterTask } from "@api/Task";

export const LoaderSession = async ({ request }: LoaderFunctionArgs) => {
    const loaderData = await MySession(request.signal);
    if (loaderData.state === false) return redirect("/auth/login");
    return loaderData;
}

export const loaderNote = async ({ request }: LoaderFunctionArgs) => {
    const loaderData = filter({
        fields: ["_id", "title", "createdAt", "isDraft"],
        query: ""
    }, request.signal);

    return defer({ loaderData });
}

export const loaderTask = async ({ request, params }: LoaderFunctionArgs) => {
    const loaderData = filterTask({
        fields: ["_id", "title", "createdAt", "isDraft", "endDate", "isComplete"],
        query: params?.is_pending === "pending" ? "isComplete=false&isDraft=false" : ""
    }, request.signal);

    return defer({ loaderData });
}
