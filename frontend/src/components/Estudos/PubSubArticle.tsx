import { IoIosReturnLeft } from "react-icons/io";

export default function PubSubArticle({ closeEstudo }: { closeEstudo: (e: any, name: string) => void }) {
    return (
        <div
            className="pubsub-article p-4"
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
                <h1 className="text-center w-100" style={{ color: "#a3e635" }}>O que é Pub/Sub?</h1>
            </div>

            <p>
                O <strong>Pub/Sub</strong> (Publisher/Subscriber) é um padrão de comunicação assíncrona usado entre sistemas. 
                Ele permite que um componente envie mensagens (publisher) sem precisar saber quem vai recebê-las, e outros componentes (subscribers) recebam essas mensagens sem precisar conhecer o emissor.
            </p>

            <h4 className="mt-3">📦 Imagine assim:</h4>
            <p className="mt-1">
                Pense em um <strong>jornal</strong> que publica notícias.  
                - Quem publica é o <strong>publisher</strong> (o jornal).  
                - Quem lê as notícias são os <strong>subscribers</strong> (os leitores).  
                Os leitores recebem as notícias quando querem, mas o jornal não precisa saber quem está lendo.
            </p>

            <h4 className="mt-3">Como funciona na prática:</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>📝 <strong>Publisher</strong> envia uma mensagem para um tópico (topic).</li>
                <li>🔔 O broker/pub-sub garante que todas as <strong>subscriptions</strong> daquele tópico recebam a mensagem.</li>
                <li>👥 <strong>Subscribers</strong> recebem a mensagem e processam no seu próprio ritmo.</li>
            </ul>

            <h4 className="mt-3">💡 Benefícios do Pub/Sub</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>🔗 <strong>Desacoplamento:</strong> publishers e subscribers não precisam conhecer uns aos outros.</li>
                <li>⚡ <strong>Escalabilidade:</strong> múltiplos subscribers podem processar mensagens simultaneamente.</li>
                <li>⏱ <strong>Assíncrono:</strong> publishers não precisam esperar os subscribers processarem as mensagens.</li>
                <li>📊 <strong>Flexível:</strong> novos subscribers podem se inscrever sem alterar o publisher.</li>
            </ul>

            <h4 className="mt-3">Exemplo simples:</h4>
            <p className="mt-1">
                Imagine um site de e-commerce:
            </p>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>📦 Um sistema de pedidos envia uma mensagem “novo pedido recebido” para o tópico <code>pedidos</code>.</li>
                <li>🧾 O sistema de faturamento está inscrito nesse tópico e gera a nota fiscal.</li>
                <li>🚚 O sistema de estoque está inscrito também e atualiza o estoque.</li>
                <li>📧 O sistema de notificações envia um e-mail para o cliente.</li>
            </ul>

            <p className="mt-3">
                Repare que o sistema de pedidos não precisa saber quantos sistemas estão ouvindo nem o que eles fazem. 
                Ele só publica a mensagem e cada subscriber processa de forma independente.
            </p>

            <h4 className="mt-3">📌 Conclusão</h4>
            <p className="mt-1">
                O Pub/Sub é perfeito para sistemas distribuídos, microsserviços e qualquer cenário onde você precisa desacoplar a produção de eventos do consumo deles.  
                É muito usado em sistemas de eventos em tempo real, notificações e integração de serviços.
            </p>
        </div>
    );
}
