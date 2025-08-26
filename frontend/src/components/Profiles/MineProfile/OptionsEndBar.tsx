import { PiEnvelopeSimpleThin } from "react-icons/pi";
import { MdOutlinePersonAddAlt1, MdOutlinePersonRemove } from "react-icons/md";
import axios from "axios";
import { useEffect, useState } from "react";
import { Player } from "../../InitialPage/Contexts/Contexts";

type Props = {
    setPlayersList: React.Dispatch<React.SetStateAction<Player[]>>;
	setResourcePlayer: React.Dispatch<React.SetStateAction<string>>;

};

type OpenState = {
    openSearch: boolean;
    method: "POST" | "DELETE" | "";
};


export default function OptionsEndBar({ setPlayersList, setResourcePlayer }: Props) {
    const [openInputSearch, setOpenInputSearch] = useState<OpenState>({
        openSearch: false,
        method: "",
    });
    const [players, setPlayers] = useState<Player[]>([]);
    const [searchValue, setSearchValue] = useState<string>("");

    // Busca todos os jogadores
    async function getPlayers() {
        try {
            const route = `${process.env.REACT_APP_API_URL}/users`;
            const res = await axios.get<Player[]>(route, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setPlayers(res.data);
        } catch (error) {
            console.error("Erro ao buscar jogadores:", error);
        }
    }

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

    useEffect(() => {
        getPlayers()
    }, [])

    // Filtra jogadores por nome
    function filterPlayersByName(value: string) {
        setSearchValue(value);
        const filtered = players.filter((p) =>
            p.nickname.toLowerCase().includes(value.toLowerCase())
        );
        setPlayersList(filtered);
    }

    // Pega o ID do jogador a partir do filtro atual e dispara a ação
    function getPlayerId(method: "POST" | "DELETE") {
        const filtered = players.filter((p) =>
            p.nickname.toLowerCase().includes(searchValue.toLowerCase())
        );

        if (filtered.length === 1) {
            handleRequestsBackend(method, filtered[0].id);
        } else {
            alert("Please select a single player.");
        }
    }

    // Renderiza campo de input
    function renderSearchInput(method: "POST" | "DELETE") {
        const placeholderText = method === "POST" ? "Add Friend" : "Remove Friend";
        return (
            <div className="rounded w-100">
                <input
                    style={{ height: "30px", width: "100%" }}
                    type="text"
                    className="remove-format-input"
                    placeholder={placeholderText}
                    value={searchValue}
                    onChange={(e) => filterPlayersByName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") getPlayerId(method);
                    }}
                />
            </div>
        );
    }

    // Handlers dos ícones (controlam abertura e método)
    function onClickOpen(method: "POST" | "DELETE") {

        setOpenInputSearch((prev) => {
            const isSame = prev.openSearch && prev.method === method;
            const next: OpenState = {
                openSearch: !isSame,
                method: isSame ? "" : method,
            };

            if (isSame) {
                setSearchValue("");
            }
            setPlayersList(players);
            return next;
        });
    }

    const styleButton: React.CSSProperties = { margin: "5px", cursor: "pointer" };

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

            {openInputSearch.openSearch &&
                openInputSearch.method &&
                renderSearchInput(openInputSearch.method)}

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
