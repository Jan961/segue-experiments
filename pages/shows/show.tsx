import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import {Show} from "../../interfaces";


export default function Search() {

    const searchRef = useRef(null)
    const [query, setQuery] = useState('')
    const [active, setActive] = useState(false)
    const [results, setResults] = useState([])

    const searchEndpoint = (query) => `/api/shows/search/${query}/false`

    const onChange = useCallback((event) => {
        const query = event.target.value;
        setQuery(query)
        if (query.length) {
            fetch(searchEndpoint(query))
                .then(res => res.json())
                .then(res => {
                    console.log(res.searchResults)
                    setResults(res.searchResults)
                })
        } else {
            setResults([])
        }
    }, [])

    const onFocus = useCallback(() => {
        setActive(true)
        window.addEventListener('click', onClick)
    }, [])

    const onClick = useCallback((event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setActive(false)
            window.removeEventListener('click', onClick)
        }
    }, [])

    return (
        <div
            className=""
            ref={searchRef}
        >
            <input
                className=""
                onChange={onChange}
                onFocus={onFocus}
                placeholder='Search posts'
                type='text'
                value={query}
            />


                <ul className=""> {results.length}
                    {results.map((item) => (

                        <li key={item.ShowId}>
                         <span>{item.Name}</span>


                        </li>
                    ))}
                </ul>

        </div>
    )
}