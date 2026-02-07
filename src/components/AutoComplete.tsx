import { useEffect, useState } from "react";

/*
    For this exercise, we’ll build a simple autocomplete search component 
    using a public API.

    Build a user autocomplete search component in React.
    https://jsonplaceholder.typicode.com/users?name_like=<query>

    Core functionality
    Render a text input.
    As the user types:
        Fetch matching users from the API.
        Show results in a dropdown below the input.
    Each result should display:
        User’s name
        User’s email
    When a result is clicked: 
        Populate the input with the selected 
        user’s name.
        Close the dropdown.

    Do not call the API on every keystroke.
    Only send a request 300ms after the user stops typing.
*/

/*
    Start 3:15 PM 2/7/26
    1. Understand, clarify, scope the requirements
        - Do we want to explicitly say no user found?
        - Is there a minimum number of characters before we try fetching?

    2. Plan of execution
        - First will probably create the basic ui of input and capturing input
        - Play around with api
        - Work on debounce logic
        - Finally fetch and list

    End 3:43 PM 2/7/26
*/
const DEFAULT_DELAY = 300
const QUERY_URL = 'https://jsonplaceholder.typicode.com/users?name_like='

// todo: type later
type User = any

const useDebounce = (input: string, delay = DEFAULT_DELAY) => {
    const [debouncedInput, setDebouncedInput] = useState('')
    useEffect(() => {
        const intervalId = setInterval(() => { setDebouncedInput(input) }, delay)
        return () => clearInterval(intervalId)
    }, [input])

    return debouncedInput
}

const useQueryUsers = (query: string) => {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    useEffect(() => {
        let mounted = true
        const fetchUsers = async () => {
            setLoading(true)
            setError(false)
            try {
                const resp = await fetch(`${QUERY_URL}${query}`)
                const data = await resp.json()
                if (mounted) {
                    setUsers(data)
                }
            } catch (error) {
                console.log("Error has occurred while fetching")
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        if (query.length > 0) {
            fetchUsers()
        } else if (query.length === 0) {
            setUsers([])
        }
        return () => { mounted = false }
    }, [query])
    return { users, loading, error }
}

const AutoComplete = () => {
    const [input, setInput] = useState('')
    const debouncedInput = useDebounce(input)
    const { users, loading, error } = useQueryUsers(debouncedInput)

    if (error) {
        return <div><p>Some error has occurred</p></div>
    }

    return (<div>
        <div>
            <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
            />
        </div>
        <div>
            {loading && <p>retrieving users...</p>}
            {!loading && !error && users?.map(user => <div key={user?.id}>{`${user?.name ?? 'n/a'}, ${user?.email ?? 'n/a'}`}</div>)}
        </div>
    </div>)
}

export default AutoComplete