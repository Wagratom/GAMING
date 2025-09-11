import { PiEnvelopeSimpleThin } from "react-icons/pi";
import { MdOutlinePersonAddAlt1, MdOutlinePersonRemove } from "react-icons/md";
import axios from "axios";
import { useState } from "react";
import { PlayerDto } from "../../InitialPage/Contexts/Contexts";

type Props = {
    setPlayersList: React.Dispatch<React.SetStateAction<PlayerDto[]>>;
    allPlayers: PlayerDto[];
    setResourcePlayer: React.Dispatch<React.SetStateAction<string>>;
};

type OpenState = {
    openSearch: boolean;
    method: "POST" | "DELETE" | "";
};


export default function OptionsEndBar({ setPlayersList, setResourcePlayer, allPlayers }: Props) {
    const [openInputSearch, setOpenInputSearch] = useState<OpenState>({ openSearch: false, method: "" });
    const [searchValue, setSearchValue] = useState<string>("");

    // Adiciona ou remove amigo
    async function handleRequestsBackend(method: "POST" | "DELETE", playerId: string) {
        try {
            const route = `${process.env.REACT_APP_API_URL}/friends`;
            await axios({
                method,
                url: route,
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                data: { friendId: playerId },
            });

            alert("Players fetched successfully.");
            setSearchValue("");
        } catch (error: any) {
            if (error.response) {
                console.error("Error:", error.response.data);
            } else {
                console.error("Error:", error.message);
            }
        }
    }

    // Filtra jogadores por nome
    function filterPlayersByName(value: string) {
        if (allPlayers.length === 0) setResourcePlayer('/users')

        setSearchValue(value);
        const filtered = allPlayers.filter((p) =>
            p.nickname.toLowerCase().includes(value.toLowerCase())
        );
        setPlayersList(filtered);
    }

    // Pega o ID do jogador a partir do filtro atual e dispara a ação
    function getPlayerId() {
        if (openInputSearch.method === "") return

        const filtered = allPlayers.filter((p) =>
            p.nickname.toLowerCase().includes(searchValue.toLowerCase())
        );

        if (filtered.length === 1) {
            handleRequestsBackend(openInputSearch.method, filtered[0].id);
        } else {
            alert("Player not found");
        }
    }

    // Handlers dos ícones (controlam abertura e método)
    function onClickOpen(method: "POST" | "DELETE") {
        setResourcePlayer('/users')
        setOpenInputSearch((prev) => {
            const isSame = prev.openSearch && prev.method === method;
            const next: OpenState = {
                openSearch: !isSame,
                method: isSame ? "" : method,
            };

            if (isSame) {
                setSearchValue("");
            }
            setPlayersList(allPlayers);
            return next;
        });
    }

    const styleButton: React.CSSProperties = { margin: "5px", cursor: "pointer" };
    const placeholderText = openInputSearch.method === "POST" ? "Add Friend" : "Remove Friend";
    return (
        <div className="d-flex align-items-center px-2" style={{ color: "#808287" }}>
            <MdOutlinePersonAddAlt1
                style={styleButton}
                title="Add Friend"
                size={25}
                onClick={() => onClickOpen("POST")}
            />
            <MdOutlinePersonRemove
                style={styleButton}
                title="Remove Friend"
                size={25}
                onClick={() => onClickOpen("DELETE")}
            />

            {
                openInputSearch.openSearch &&
                openInputSearch.method &&
                (
                    <div className="rounded w-100">
                        <input
                            style={{ height: "30px", width: "100%" }}
                            type="text"
                            className="remove-format-input"
                            placeholder={placeholderText}
                            value={searchValue}
                            onChange={(e) => filterPlayersByName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") getPlayerId(); }}
                        />
                    </div>
                )
            }

            <div className="d-flex justify-content-end options ms-auto">
                <PiEnvelopeSimpleThin
                    title="Notifications"
                    className="me-2"
                    style={styleButton}
                    size={25}
                    onClick={() => setResourcePlayer("/notifications?status=PENDING")}
                />
            </div>
        </div>
    );
}
