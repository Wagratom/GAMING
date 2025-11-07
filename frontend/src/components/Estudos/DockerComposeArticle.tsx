import { IoIosReturnLeft } from "react-icons/io";

export default function DockerComposeArticle({ closeEstudo }: { closeEstudo: (e: any, name: string) => void }) {
    return (
        <div
            className="docker-compose-article p-4"
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
                <h1 className="text-center w-100" style={{ color: "#a3e635" }}>📦 O que é Docker Compose?</h1>
            </div>

            <p className="mt-3">
                O <strong>Docker Compose</strong> é uma ferramenta que permite <strong>definir e rodar múltiplos contêineres Docker ao mesmo tempo</strong> usando um único arquivo de configuração.
            </p>

            <p className="mt-3">
                Em vez de iniciar cada contêiner separadamente, você descreve todos os serviços (aplicação, banco de dados, cache, etc.) em um arquivo chamado <code>docker-compose.yml</code> e executa tudo com um único comando.
            </p>

            <h4 className="mt-4">💡 Imagine assim:</h4>
            <p className="mt-1">
                Pense em Docker Compose como uma orquestra:
            </p>
            <ul style={{ paddingLeft: "20px" }}>
                <li>Cada contêiner é um músico (aplicação, banco, cache, etc.).</li>
                <li>O Docker Compose é o maestro que coordena todos, garantindo que cada um comece na ordem correta e se comunique adequadamente.</li>
            </ul>

            <h4 className="mt-4">📝 Exemplo simples</h4>
            <p className="mt-1">
                Um arquivo <code>docker-compose.yml</code> para uma aplicação web com banco PostgreSQL poderia ser assim:
            </p>

            <pre
                className="mt-2"
                style={{
                    background: "#27293d",
                    padding: "16px",
                    borderRadius: "8px",
                    color: "#a3e635",
                    whiteSpace: "pre",
                    fontFamily: "monospace",
                    display: "table",
                    width: "100%",
                }}
            >
{`version: '3'
services:
  web:
    image: minha-aplicacao:latest
    ports:
      - "8080:8080"
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: meu_banco`}
            </pre>

            <p className="mt-3">
                Com apenas <code>docker-compose up</code>, você sobe a aplicação inteira com banco de dados pronto para uso. Sem instalar nada manualmente, sem se preocupar com ordem de inicialização.
            </p>

            <h4 className="mt-4">💡 Benefícios do Docker Compose</h4>
            <ul style={{ paddingLeft: "20px" }}>
                <li>⚡ <strong>Rapidez:</strong> iniciar múltiplos contêineres com um comando.</li>
                <li>🔄 <strong>Consistência:</strong> todos os serviços rodam sempre da mesma forma, independentemente da máquina.</li>
                <li>🛠 <strong>Fácil manutenção:</strong> versiona os serviços no repositório como qualquer outro código.</li>
                <li>🌍 <strong>Integração de serviços:</strong> conecta bancos, caches, filas e APIs de forma simples.</li>
            </ul>
        </div>
    );
}
