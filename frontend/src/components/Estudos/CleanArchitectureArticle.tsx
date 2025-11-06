import { IoIosReturnLeft } from "react-icons/io";

export default function CleanArchitectureArticle({ closeEstudo }: { closeEstudo: (e: any, name: string) => void }) {
    return (
        <div
            className="clean-article p-4"
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
                <h1 className="text-center w-100" style={{ color: "#a3e635" }}>O que é Clean Architecture?</h1>
            </div>

            <p className="mt-3">
                Se você já tem experiência na área, provavelmente já aplica alguns conceitos de <strong>Clean Architecture</strong> sem perceber.
                Esses conceitos aparecem em várias arquiteturas conhecidas — por exemplo: <strong>Hexagonal</strong>, <strong>Onion</strong>, <strong>MVC</strong> (entre outras).
            </p>

            <p className="mt-3">
                A <strong>Clean Architecture</strong> (ou <em>Arquitetura Limpa</em>) é um conjunto de princípios propostos por <strong>Robert C. Martin (Uncle Bob)</strong>,
                com o objetivo de criar sistemas <strong>independentes de frameworks</strong>, fáceis de <strong>testar</strong>, <strong>manter</strong> e <strong>evoluir</strong>.
            </p>

            <p className="mt-3">
                Importante: <strong>Clean Architecture</strong> é um princípio, não um manual rígido. Podemos aplicá-lo de várias formas.
                Uma das ideias centrais é <strong>separar responsabilidades por camadas</strong>, de modo que as regras de negócio (o domínio) fiquem no centro,
                e os detalhes (como banco de dados, frameworks ou UI) dependam do domínio — não o contrário.
            </p>

            <p className="mt-3">
                Ou seja: <strong>as regras de negócio devem ser o centro do sistema</strong>, e tudo o resto gira em torno delas. Assim você evita que a aplicação fique
                acoplada a tecnologias específicas (ORMs, frameworks web, bancos de dados etc.). Trocar uma dessas partes passa a ser muito mais simples.
                Isso fica mais claro quando entendemos contratos, interfaces e o princípio da inversão de dependências.
            </p>

            <h4 className="mt-4">🔄 A ideia dos círculos concêntricos</h4>
            <p>
                Um dos diagramas mais famosos da Clean Architecture organiza o sistema em camadas em formato de círculos, onde as dependências sempre apontam para dentro:
            </p>

            <pre
                className="mt-3"
                style={{
                    background: "#27293d",
                    padding: "16px",
                    borderRadius: "8px",
                    color: "#a3e635",
                    whiteSpace: "pre",
                    fontFamily: "monospace",
                    display: "table"
                }}
            >
{`+-----------------------------+
|        Frameworks & UI      |  → ex: Spring, React, FastAPI
+-----------------------------+
|     Interface Adapters      |  → Controllers, DTOs, Gateways
+-----------------------------+
|          Use Cases          |  → lógica de aplicação (casos de uso)
+-----------------------------+
|           Domain            |  → entidades e regras de negócio
+-----------------------------+`}
            </pre>

            <p className="mt-3">
                As camadas internas (como o <code>Domain</code>) não conhecem os detalhes externos. Já as camadas externas conhecem e dependem das internas.
            </p>

            <h4 className="mt-4">🧱 Benefícios</h4>
            <ul className="list-disc list-inside ml-4">
                <li><strong>Desacoplamento:</strong> você pode trocar banco, framework ou UI sem tocar na regra de negócio.</li>
                <li><strong>Testabilidade:</strong> cada camada pode ser testada isoladamente.</li>
                <li><strong>Evolução:</strong> o sistema cresce de forma organizada, com limites claros entre responsabilidades.</li>
                <li><strong>Legibilidade:</strong> o código tende a refletir o domínio do negócio, não a tecnologia usada.</li>
            </ul>

            <p className="mt-3">
                Quer que eu agora explique, uma a uma, as camadas principais (<strong>Domain</strong>, <strong>Use Cases</strong>, <strong>Interface Adapters</strong> e <strong>Infrastructure</strong>) com exemplos práticos?
                Depois a gente transforma tudo em um componente HTML/React pronto para colar no seu projeto.
            </p>
        </div>
    );
}
