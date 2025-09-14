import React from "react";

type PhotoWithOnlineStatusProps = {
    online: boolean;
    imgSrc: string;
    photoHeight: string;
    photoWidth: string;
    positionTop: string;
    positionEnd: string;
    callback?: () => void;
};

export default function PhotoWithOnlineStatus(props: PhotoWithOnlineStatusProps): JSX.Element {
    const sizePhoto: React.CSSProperties = {
        width: props.photoWidth,
        height: props.photoHeight,
    };

    const positionOnline: React.CSSProperties = {
        position: "absolute",
        top: props.positionTop,
        left: props.positionEnd,
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (props.callback) {
            props.callback();
        }
        e.stopPropagation(); 
    };

    return (
        <div className="position-relative" onClick={handleClick}>
            <img
                className="rounded-circle me-3"
                src={props.imgSrc}
                alt="foto"
                style={sizePhoto}
            />
            <div
                className={`borda ${props.online ? "borda-online" : "borda-offline"}`}
                style={positionOnline}
            >
                <div
                    className={`circle ${props.online ? "circle-online" : "circle-offline"
                        }`}
                ></div>
            </div>
        </div>
    );
}
