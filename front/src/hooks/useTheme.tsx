import { useEffect, useState } from "react";

const useTheme = () => {
    const [dataIsDarkMode, setDataIsDarkMode] = useState<boolean>(localStorage.getItem("isDarkMode") === "true");

    const initialize = () => {
        localStorage.setItem("isDarkMode", dataIsDarkMode.toString());
        const isDarkMode = localStorage.getItem("isDarkMode");
        if (isDarkMode === "true" || (isDarkMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const toggleDarkMode = () => {
        setDataIsDarkMode(mdata => !mdata);
    }

    useEffect(() => {
        initialize();
    }, [dataIsDarkMode]);

    return ({
        toggleDarkMode,
        dataIsDarkMode
    });
}

export default useTheme;
