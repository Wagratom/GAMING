import { IoIosReturnLeft } from "react-icons/io";

export default function KafkaArticle({ closeEstudo }: { closeEstudo: (e: any, name: string) => void }) {
    return (
        <div
            className="kafka-article p-4"
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
                <h1 className="text-center w-100" style={{ color: "#a3e635" }}>☕ O que é Kafka?</h1>
            </div>

            <p className="mt-3">
                O <strong>Apache Kafka</strong> é uma plataforma de streaming distribuída, projetada para enviar, receber e processar grandes volumes de dados em tempo real.  
                Assim como RabbitMQ, ele funciona como um <strong>message broker</strong>, mas é otimizado para alta performance, persistência e processamento contínuo.
            </p>

            <h4 className="mt-4">🍽 Exemplo prático: restaurante moderno</h4>
            <p className="mt-1">
                Imagine novamente o restaurante. O garçom coloca pedidos na fila, mas agora temos múltiplos cozinheiros, chefs especializados, e até um sistema que envia notificações em tempo real aos clientes.  
                O Kafka mantém todos os pedidos e eventos registrados em um <strong>log imutável</strong> que pode ser lido por qualquer consumidor quando quiser.  
                Isso permite processar dados em paralelo, manter histórico e escalar sem problemas.
            </p>

            <h4 className="mt-4">📦 Componentes principais</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li><strong>Producer (Produtor):</strong> envia mensagens para tópicos. No restaurante, o garçom registra pedidos.</li>
                <li><strong>Topic (Tópico):</strong> canal lógico para organizar mensagens, similar a “filas de pedidos por tipo de prato”.</li>
                <li><strong>Partition (Partição):</strong> divisão de tópicos para paralelismo e escalabilidade. Cada partição é processada por um consumidor de cada vez.</li>
                <li><strong>Consumer (Consumidor):</strong> lê mensagens de tópicos/partições. Podem ser vários, processando em paralelo.</li>
                <li><strong>Broker:</strong> servidor Kafka que armazena mensagens e gerencia tópicos/partições.</li>
            </ul>

            <h4 className="mt-4">🔄 Fluxo simplificado</h4>
            <ol className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>🧍‍♂️ Garçom (produtor) coloca o pedido em um tópico Kafka.</li>
                <li>📂 O tópico mantém um log ordenado de todas as mensagens (pedidos).</li>
                <li>👨‍🍳 Cozinheiros (consumidores) pegam as mensagens do tópico/partição que precisam processar.</li>
                <li>🔄 Consumidores diferentes podem processar simultaneamente e até reprocessar pedidos antigos usando o log.</li>
            </ol>

            <h4 className="mt-4">💡 Benefícios do Kafka</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li><strong>Alta performance:</strong> consegue processar milhões de mensagens por segundo.</li>
                <li><strong>Persistência:</strong> mensagens ficam gravadas no log, permitindo reprocessamento.</li>
                <li><strong>Escalabilidade:</strong> particionamento permite adicionar consumidores para processar dados em paralelo.</li>
                <li><strong>Desacoplamento:</strong> produtores e consumidores não precisam se conhecer.</li>
                <li><strong>Resiliência:</strong> falhas em consumidores não causam perda de dados.</li>
            </ul>

            <h4 className="mt-4">⚖️ Kafka x RabbitMQ</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li><strong>RabbitMQ:</strong> ótimo para filas de tarefas, processamento assíncrono e mensagens pontuais.</li>
                <li><strong>Kafka:</strong> ideal para streaming de dados em tempo real, alta performance, logs imutáveis e múltiplos consumidores.</li>
                <li><strong>Resumo:</strong> RabbitMQ foca em mensagens individuais e controle de fluxo; Kafka foca em alto volume, histórico e streaming contínuo.</li>
            </ul>
        </div>
    );
}
