import { createBrowserRouter, Navigate } from "react-router-dom";
import Welcome from "@views/welcome";

import Auth from "@views/Auth";
import FormLogin from "@components/FormLogin";
import FormRegister from "@components/FormRegister";
import RegisterMessage from "@components/RegisterMessage";
import RegisterComplete from "@components/RegisterComplete";
import FormForgot from "@components/FormForgot";

import Dashboard from "@views/Dashboard";
import Home from "@components/Home";
import Task from "@components/Task";
import Note from "@components/Note";
import Config from "@components/Config";

import { LoaderSession, loaderNote, loaderTask } from "./Loaders";

const Routes = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard />,
        loader: LoaderSession,
        id: "root",
        children: [
            {
                index: true,
                element: <Navigate to={"/home"} replace />
            },
            {
                path: "home",
                element: <Home />
            },
            {
                path: "task/:is_pending?",
                loader: loaderTask,
                element: <Task />
            },
            {
                path: "note/:title?",
                loader: loaderNote,
                element: <Note />
            },
            {
                path: "config",
                element: <Config />
            }
        ]
    },
    {
        path: "/welcome",
        element: <Welcome />,
    },
    {
        path: "/auth",
        element: <Auth />,
        children: [
            {
                index: true,
                element: <Navigate to={"/auth/login"} replace />,
            },
            {
                path: "login",
                element: <FormLogin />,
            },
            {
                path: "register",
                element: <FormRegister />
            },
            {
                path: "register_message",
                element: <RegisterMessage />
            },
            {
                path: "register_complete",
                element: <RegisterComplete />
            },
            {
                path: "forgot",
                element: <FormForgot />
            }
        ]
    }
], { basename: "/" });


export default Routes;
