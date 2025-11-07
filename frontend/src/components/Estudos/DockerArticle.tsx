import { IoIosReturnLeft } from "react-icons/io";

export default function DockerArticle({ closeEstudo }: { closeEstudo: (e: any, name: string) => void }) {
    return (
        <div
            className="docker-article p-4"
            style={{
                color: "#fff",
                background: "#1e1e2f",
                borderRadius: "12px",
                lineHeight: "1.6",
                display: "flex",
                flexDirection: "column",
                overflowY: "scroll",
                maxHeight: "100%",
            }}
        >
            <div className="d-flex align-items-center">
                <IoIosReturnLeft size={25} className="text-start c-pointer" onClick={(e) => closeEstudo(e, '')} />
                <h1 className="text-center w-100" style={{ color: "#a3e635" }}>🐳 O que é Docker?</h1>
            </div>

            <p className="mt-3">
                Docker é uma plataforma que permite <strong>empacotar uma aplicação e suas dependências em um contêiner</strong>, 
                que é como uma “caixinha portátil” que roda em qualquer lugar — no seu computador, no servidor da empresa ou na nuvem.
            </p>

            <p className="mt-3">
                Em termos simples, <strong>Docker garante que sua aplicação funcione da mesma forma em qualquer ambiente</strong>, 
                evitando o famoso problema de “na minha máquina funciona”.
            </p>

            <h4 className="mt-4">📦 Imagine assim:</h4>
            <p className="mt-1">
                Pense em contêineres como caixinhas de almoço:
            </p>
            <ul style={{ paddingLeft: "20px" }}>
                <li>Cada caixinha contém <strong>tudo que você precisa</strong>: comida, talheres, guardanapo.</li>
                <li>Você pode levar essa caixinha para qualquer lugar e abrir: tudo dentro funciona.</li>
            </ul>

            <p className="mt-3">
                No Docker, cada contêiner contém:
            </p>
            <ul style={{ paddingLeft: "20px" }}>
                <li>Sua aplicação</li>
                <li>Bibliotecas e dependências</li>
                <li>Configurações necessárias para rodar</li>
            </ul>

            <h4 className="mt-4">💡 Por que usar Docker?</h4>
            <ul style={{ paddingLeft: "20px" }}>
                <li>🌍 <strong>Portabilidade:</strong> Rodar a mesma aplicação em qualquer máquina ou servidor sem surpresas.</li>
                <li>🛡 <strong>Isolamento:</strong> Cada contêiner é isolado, então uma aplicação não interfere na outra.</li>
                <li>⚡ <strong>Escalabilidade:</strong> É fácil criar várias instâncias da mesma aplicação, facilitando o balanceamento de carga.</li>
                <li>📏 <strong>Consistência:</strong> O comportamento da aplicação será o mesmo em todos os ambientes, de desenvolvimento a produção.</li>
            </ul>

            <h4 className="mt-4">🔧 Conceitos principais</h4>
            <ul style={{ paddingLeft: "20px" }}>
                <li><strong>Imagem (Image):</strong> modelo da aplicação que define o que será instalado e configurado dentro do contêiner.</li>
                <li><strong>Contêiner (Container):</strong> instância de uma imagem em execução.</li>
                <li><strong>Dockerfile:</strong> arquivo que descreve passo a passo como criar a imagem.</li>
                <li><strong>Docker Hub:</strong> repositório online de imagens Docker prontas.</li>
            </ul>

            <h4 className="mt-4">🖥 Exemplo prático</h4>
            <p className="mt-1">
                Imagine que você tem uma aplicação Java com banco de dados PostgreSQL:
            </p>
            <ul style={{ paddingLeft: "20px" }}>
                <li>Sem Docker: você precisaria instalar Java, configurar o PostgreSQL, criar bancos, ajustar variáveis de ambiente… um verdadeiro quebra-cabeça.</li>
                <li>Com Docker: você cria dois contêineres — um para a aplicação e outro para o banco — e os conecta. Resultado: funciona em qualquer máquina, sem precisar instalar nada manualmente.</li>
            </ul>
        </div>
    );
}
