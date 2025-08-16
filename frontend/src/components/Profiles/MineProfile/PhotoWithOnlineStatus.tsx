type PhotoWithOnlineStatusProps = {
    online: boolean;
    imgSrc: string;
    photoHeight: string;
    photoWidth: string;
    positionTop: string;
    positionEnd: string;
};
export default function PhotoWithOnlineStatus(props: PhotoWithOnlineStatusProps): JSX.Element {
    const sizePhoto: React.CSSProperties = {
        width: props.photoWidth,
        height: props.photoHeight,
    }

    const positionOnline: React.CSSProperties = {
        position: 'absolute',
        top: props.positionTop,
        left: props.positionEnd,
    }

    if (props.online) {
        return (
            <div className='position-relative'>
                <img className="rounded-circle me-3" src={props.imgSrc} alt='foto' style={sizePhoto}/>
                <div className="borda borda-online" style={positionOnline}>
                    <div className="circle circle-online"></div>
                </div>
            </div>
        )
    }
    return (
        <div className='position-relative'>
            <img className="rounded-circle me-3" src={props.imgSrc} alt='foto' style={sizePhoto}/>
            <div className="borda borda-offline"  style={positionOnline}>
                <div className="circle circle-offline"></div>
            </div>
        </div>
    )
}
