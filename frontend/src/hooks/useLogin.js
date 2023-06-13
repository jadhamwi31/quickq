import { useState } from 'react'

import { useNavigate } from 'react-router-dom';


export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)

    const navigate = useNavigate();

    const login = async (username, password) => {
        setIsLoading(true)
        setError(null)

        const response = await fetch('auth/login', {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        const json = await response.json()

        if (!response.ok) {
            setIsLoading(false)
            setError(json.message)
        }
        if (response.ok) {



            navigate('/');
            // update loading state
            setIsLoading(false)
        }
    }

    return { login, isLoading, error }
}