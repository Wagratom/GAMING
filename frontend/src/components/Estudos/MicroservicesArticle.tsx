import { IoIosReturnLeft } from "react-icons/io";

export default function MicroservicesArticle({ closeEstudo }: { closeEstudo: (e: any, name: string) => void }) {
    return (
        <div
            className="microservices-article p-4"
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
                <h1 className="text-center w-100" style={{ color: "#a3e635" }}>O que são Microserviços?</h1>
            </div>

            <p className="mt-3">
                <strong>Microserviços</strong> são uma forma de arquitetar aplicações dividindo-as em pequenos serviços independentes, 
                cada um responsável por uma funcionalidade específica do sistema.
            </p>

            <p className="mt-3">
                Diferente de uma arquitetura monolítica, onde tudo está junto em um único aplicativo, nos microserviços cada módulo é um serviço isolado, 
                que se comunica com outros serviços via APIs ou mensagens.
            </p>

            <h4 className="mt-4">💡 Conceitos principais</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>🔹 <strong>Serviço independente:</strong> cada microserviço pode ser desenvolvido, implantado e escalado separadamente.</li>
                <li>🌐 <strong>Comunicação via API ou mensageria:</strong> serviços conversam entre si usando HTTP/REST, gRPC, ou filas de mensagens como RabbitMQ/Kafka.</li>
                <li>📦 <strong>Desacoplamento:</strong> falhas em um serviço não derrubam o sistema inteiro.</li>
                <li>⚙️ <strong>Escalabilidade granular:</strong> cada serviço pode ser escalado individualmente conforme a demanda.</li>
                <li>🧩 <strong>Organização por domínio:</strong> cada microserviço foca em uma parte do negócio, facilitando manutenção e evolução.</li>
            </ul>

            <h4 className="mt-4">🚀 Vantagens dos Microserviços</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>💨 <strong>Agilidade:</strong> equipes diferentes podem trabalhar em serviços distintos ao mesmo tempo.</li>
                <li>🔄 <strong>Atualizações independentes:</strong> é possível atualizar ou corrigir um serviço sem afetar o restante da aplicação.</li>
                <li>📈 <strong>Escalabilidade eficiente:</strong> apenas os serviços mais demandados precisam de mais recursos.</li>
                <li>🛠 <strong>Facilidade de adoção de novas tecnologias:</strong> cada serviço pode usar a linguagem ou framework mais adequado.</li>
            </ul>

            <h4 className="mt-4">📦 Exemplo prático</h4>
            <p className="mt-2">
                Imagine um e-commerce. Em vez de ter um único sistema que gerencia produtos, pedidos, usuários e pagamentos, 
                você cria microserviços separados: 
            </p>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>🛒 Serviço de carrinho de compras</li>
                <li>📦 Serviço de estoque</li>
                <li>💳 Serviço de pagamentos</li>
                <li>👤 Serviço de usuários</li>
            </ul>
            <p className="mt-2">
                Cada serviço é independente, pode ser escalado sozinho e até escrito em linguagens diferentes, 
                contanto que sigam um contrato de comunicação claro entre eles.
            </p>

            <h4 className="mt-4">⚠️ Pontos de atenção</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>🔗 Comunicação entre serviços precisa ser confiável.</li>
                <li>📝 Gestão de logs e monitoramento se torna mais complexa.</li>
                <li>🔐 Autenticação e autorização devem ser bem planejadas, principalmente em APIs distribuídas.</li>
                <li>💡 Evitar criar microserviços muito pequenos que aumentam complexidade sem benefício.</li>
            </ul>
        </div>
    );
}
