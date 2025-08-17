import { PiEnvelopeSimpleThin } from "react-icons/pi";
import { MdOutlinePersonAddAlt1, MdOutlinePersonRemove } from "react-icons/md";
import axios from "axios";
import { useState } from "react";

export default function OptionsEndBar() {
    const [search, setSearch] = useState<string>("");
    const [openInputSearch, setOpenInputSearch] = useState<boolean>(false);

    const styleButton: React.CSSProperties = {
        margin: '5px',
        cursor: 'pointer',
    }

    function handleRequestsBackend(resource: string) {
        const route = process.env.REACT_APP_API_URL + resource
        axios.post(route, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        }).then((res) => {
        }).catch(() => { })
    }

    function returnInput(func: (event: React.KeyboardEvent<HTMLInputElement>) => void) {
        return (
            <div className='rounded'>
                <input
                    style={{ height: '30px', width: '100%' }}
                    type='text'
                    className='remove-format-input'
                    placeholder='Search Friend'
                    onKeyDown={func}
                />
            </div>
        )
    }

    return (
        <div className='d-flex align-items-center px-2' style={{ color: "#808287" }}>
            {/* visualizar os amigos */}
            {/* visualizar todos os usuarios */}
            <MdOutlinePersonAddAlt1
                style={styleButton}
                title="Add Friend"
                size={30}
                onClick={() => setOpenInputSearch(!openInputSearch)}
            />
            <MdOutlinePersonRemove
                style={styleButton}
                title="Remove Friend"
                size={30}
                onClick={() => setOpenInputSearch(!openInputSearch)}
            />
            {openInputSearch && returnInput((event) => {
                if (event.key === 'Enter') {
                    handleRequestsBackend(`/users/search?username=${search}`);
                    setSearch("");
                }
            })}
            <div className='d-flex justify-content-end w-100 options'>
                <PiEnvelopeSimpleThin
                    title="notifications"
                    className="me-2"
                    style={styleButton}
                    size={25}
                />
            </div>
        </div>
    )
}

