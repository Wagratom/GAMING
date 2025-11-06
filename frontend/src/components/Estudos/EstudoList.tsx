import '../PublicChatsPage/PublicChats.css';
import { IoMdClose } from 'react-icons/io';
import DDDArticle from './DDDArticle';
import { useState, MouseEvent } from 'react';
import SOLIDArticle from './SOLIDArticle';
import CleanArchitectureArticle from './CleanArchitectureArticle';
import JwtArticle from './JwtArticle';
import OAuthArticle from './OAuthArticle';
import SessionArticle from './SessionArticle';

type PropsRanking = {
    openPublicChat: (name: string) => void;
};

type EstudoItem = {
    nome: string;
    autor: string;
    component?: JSX.Element; // opcional, caso queira abrir um artigo específico
};

export default function EstudoList({ openPublicChat }: PropsRanking) {
    const [selected, setSelected] = useState<string>('');

    const handleClick = (e: MouseEvent<HTMLDivElement>, nome: string) => {
        e.stopPropagation(); // impede propagação
        setSelected(nome);
    };


    const estudos: EstudoItem[] = [
        { nome: 'DDD', autor: 'bankai', component: <DDDArticle closeEstudo={handleClick} /> },
        { nome: 'SOLID', autor: 'bankai', component: <SOLIDArticle closeEstudo={handleClick} /> },
        { nome: 'Clean Architecture', autor: 'bankai', component: <CleanArchitectureArticle closeEstudo={handleClick} /> },
        { nome: 'Session Authentication', autor: 'bankai', component: <SessionArticle closeEstudo={handleClick} /> },
        { nome: 'JWT Authentication', autor: 'bankai', component: <JwtArticle closeEstudo={handleClick} /> },
        { nome: 'OAuth Authentication', autor: 'bankai', component: <OAuthArticle closeEstudo={handleClick} /> },
        // Adicione quantos estudos quiser
    ];

    return (
        <div className="position-fixed top-50 start-50 translate-middle public-chats-screen">
            <IoMdClose
                className="button-close"
                style={{
                    backgroundColor: '#2b2b3d',
                    boxShadow:
                        'rgb(255, 255, 255) 2px 2px 1px inset, rgba(30, 30, 47, 0.95) -8px -8px 8px inset',
                    top: '-50px',
                    right: '-50px',
                }}
                onClick={() => openPublicChat('handleClick')}
            />

            {selected && (
                <div className='h-100 d-flex'>
                    {
                        estudos.find((estudo) => estudo.nome === selected)?.component ||
                        <div className="chat-card p-3">
                            <p>{selected}</p>
                            <button onClick={() => setSelected('')}>Voltar</button>
                        </div>
                    }
                </div>
            )}

            <div className='d-flex p-3 overflow-auto' id='showChats'>
                <div className="row g-0 w-100">

                    {!selected && (
                        estudos.map((estudo) => (
                            <div
                                className="col-12 col-md-6 col-lg-4"
                                key={estudo.nome}
                                onClick={(e) => handleClick(e, estudo.nome)}
                            >
                                <div className="chat-card">
                                    <div className="chat-header">
                                        <p className="chat-name">{estudo.nome}</p>
                                    </div>
                                    <p className="chat-owner">👑 Author: {estudo.autor}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div >
    )

}
