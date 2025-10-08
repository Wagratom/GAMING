import { SetStateAction } from "react";

export default function InviteErro({ msg, close }: { msg: string, close: React.Dispatch<SetStateAction<string>> }) {
    const modalStyle: React.CSSProperties = {
        background: "env(--modal-bg, #1a1a1a)",
        color: "env(--modal-text, #ffffff)",
        padding: "20px 30px",
        borderRadius: "10px",
        textAlign: "center",
        width: "350px",
        boxShadow: "0 0 15px env(--modal-shadow, rgba(0,0,0,0.3))",
    };

    const buttonStyle: React.CSSProperties = {
        marginTop: "15px",
        padding: "5px 15px",
        border: "none",
        backgroundColor: "env(--modal-button-bg, #00bfff)",
        color: "white",
        borderRadius: "5px",
        cursor: "pointer",
    };

    const overlayStyle: React.CSSProperties = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <p>{msg}</p>
                <button
                    style={buttonStyle}
                    onMouseOver={(e) =>
                    ((e.target as HTMLButtonElement).style.backgroundColor =
                        "env(--modal-button-bg-hover, #009acd)")
                    }
                    onMouseOut={(e) =>
                    ((e.target as HTMLButtonElement).style.backgroundColor =
                        "env(--modal-button-bg, #00bfff)")
                    }
                    onClick={() => close("")}
                >
                    Fechar
                </button>
            </div>
        </div>
    );
}
