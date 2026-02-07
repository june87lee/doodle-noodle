import React, { useEffect, useState, useRef } from "react";

const QUERY_URL = "https://jsonplaceholder.typicode.com/users?name_like=";
const DEFAULT_DELAY = 300;

type User = {
    id: number;
    name: string;
    email: string;
};

function useDebouncedValue<T>(value: T, delay = DEFAULT_DELAY) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const id = window.setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return debounced;
}

function useQueryUsers(query: string) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!query || query.length === 0) {
            setUsers([]);
            setLoading(false);
            setError(null);
            return;
        }

        const controller = new AbortController();
        let mounted = true;

        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const resp = await fetch(`${QUERY_URL}${encodeURIComponent(query)}`, {
                    signal: controller.signal,
                });
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                const data = await resp.json();
                if (mounted) setUsers(data);
            } catch (err: any) {
                if (err.name === "AbortError") {
                    // ignored - request was canceled
                } else {
                    setError(err.message ?? "Fetch error");
                    setUsers([]);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchUsers();

        return () => {
            mounted = false;
            controller.abort();
        };
    }, [query]);

    return { users, loading, error };
}

const AutoComplete: React.FC = () => {
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const debounced = useDebouncedValue(input, DEFAULT_DELAY);
    const { users, loading, error } = useQueryUsers(debounced);

    const containerRef = useRef<HTMLDivElement | null>(null);

    // close on outside click
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (!containerRef.current) return;
            if (!containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setSelectedIndex(null);
            }
        };
        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, []);

    useEffect(() => {
        // open dropdown if there are results or loading
        if (debounced && (loading || users.length > 0)) setIsOpen(true);
        else setIsOpen(false);
    }, [debounced, loading, users]);

    const handleSelect = (u: User) => {
        setInput(u.name);
        setIsOpen(false);
        setSelectedIndex(null);
    };

    // optional keyboard support
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((s) => (s === null ? 0 : Math.min(users.length - 1, s + 1)));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((s) => (s === null ? users.length - 1 : Math.max(0, s - 1)));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (selectedIndex != null && users[selectedIndex]) handleSelect(users[selectedIndex]);
        } else if (e.key === "Escape") {
            setIsOpen(false);
            setSelectedIndex(null);
        }
    };

    return (
        <div ref={containerRef} style={{ width: 360, position: "relative" }}>
            <input
                aria-label="Search users"
                value={input}
                onChange={(e) => {
                    setInput(e.target.value);
                    setSelectedIndex(null);
                }}
                onKeyDown={onKeyDown}
                placeholder="Search users by name"
                style={{ width: "100%", boxSizing: "border-box" }}
            />

            {isOpen && (
                <div
                    role="listbox"
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        background: "white",
                        border: "1px solid #ddd",
                        maxHeight: 240,
                        overflow: "auto",
                        zIndex: 10,
                    }}
                >
                    {loading && <div style={{ padding: 8 }}>Loading...</div>}
                    {!loading && error && <div style={{ padding: 8, color: "red" }}>Error: {error}</div>}
                    {!loading && !error && users.length === 0 && <div style={{ padding: 8 }}>No users found.</div>}
                    {!loading &&
                        !error &&
                        users.map((u, i) => (
                            <div
                                key={u.id}
                                role="option"
                                aria-selected={selectedIndex === i}
                                onMouseDown={(ev) => {
                                    // use onMouseDown to prevent input blur before click
                                    ev.preventDefault();
                                    handleSelect(u);
                                }}
                                style={{
                                    padding: 8,
                                    background: selectedIndex === i ? "#f0f0f0" : "transparent",
                                    cursor: "pointer",
                                }}
                            >
                                <div style={{ fontWeight: 600 }}>{u.name}</div>
                                <div style={{ fontSize: 12, color: "#555" }}>{u.email}</div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default AutoComplete;
