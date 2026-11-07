import { useState, useCallback } from "react";

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (
        url,
        method = 'GET',
        body = null,
        headers,
        signal
    ) => {

        setLoading(true);

        try {
            const requestOptions = {method, signal};

            if (body !== null) {
                requestOptions.body = body;
                requestOptions.headers = headers ?? {'Content-Type': 'application/json'};
            } else if (headers) {
                requestOptions.headers = headers;
            }

            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }

            const data = await response.json();

            setLoading(false);
            return data;
        } catch(e) {
            setLoading(false);
            if (e.name !== 'AbortError') {
                setError(e.message);
            }
            throw e;
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return {loading, request, error, clearError}
}
