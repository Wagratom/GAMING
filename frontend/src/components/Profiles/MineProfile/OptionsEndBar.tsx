import { PiEnvelopeSimpleThin } from "react-icons/pi";
import { MdOutlinePersonAddAlt1, MdOutlinePersonRemove } from "react-icons/md";

export default function OptionsEndBar() {
    const styleButton: React.CSSProperties = {
        margin: '5px',
        cursor: 'pointer',
    }

    return (
        <div className='d-flex align-items-center px-2' style={{ color: "#808287" }}>
            {/* visualizar os amigos */}
            {/* visualizar todos os usuarios */}
            <MdOutlinePersonAddAlt1
                style={styleButton}
                title="Add Friend"
                size={30}
            />
            <MdOutlinePersonRemove
                style={styleButton}
                title="Remove Friend"
                size={30}
            />
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

