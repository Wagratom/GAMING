import { IoIosReturnLeft } from "react-icons/io";

export default function RabbitMQArticle({ closeEstudo }: { closeEstudo: (e: any, name: string) => void }) {
    return (
        <div
            className="rabbitmq-article p-4"
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
                <h1 className="text-center w-100" style={{ color: "#a3e635" }}>🐇 O que é RabbitMQ?</h1>
            </div>

            <p className="mt-3">
                O <strong>RabbitMQ</strong> é um <strong>message broker</strong> ou fila de mensagens. Ele serve para enviar, receber e gerenciar mensagens entre sistemas ou partes de uma aplicação.
            </p>

            <p className="mt-3">
                Em termos simples, imagine um <strong>correio interno</strong> entre diferentes partes do seu sistema.  
                Um sistema coloca uma mensagem na fila (ex: “novo pedido recebido”) e outro sistema pega essa mensagem e processa (ex: “gerar nota fiscal”).
            </p>

            <p className="mt-3">
                Ele é muito usado para <strong>desacoplar sistemas</strong>, trabalhar com <strong>processamento assíncrono</strong> e melhorar a <strong>escalabilidade</strong>.
            </p>

            <h4 className="mt-4">🍽 Exemplo prático: o restaurante</h4>
            <p className="mt-1">
                Imagine um restaurante. O garçom recebe o pedido, leva para o cozinheiro e fica esperando a comida ficar pronta.  
                O problema: os outros clientes ficam esperando também porque o garçom não consegue pegar os proximos pedidos.  
                Com RabbitMQ, ao invés disso, o garçom coloca o pedido em uma <strong>fila de pedidos</strong>. O cozinheiro vai processando conforme disponível e, quando pronto, o garçom pega a comida.  
                Assim, ninguém precisa ficar esperando diretamente pelo outro.
            </p>

            <h4 className="mt-4">📦 Componentes principais</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li><strong>Producer (Produtor):</strong> envia a mensagem. No restaurante, seria o garçom anotando o pedido.</li>
                <li><strong>Queue (Fila):</strong> armazena mensagens até serem processadas. No restaurante, é a fila de pedidos na cozinha.</li>
                <li><strong>Consumer (Consumidor):</strong> lê/processa mensagens. O cozinheiro pega os pedidos da fila e prepara os pratos.</li>
                <li><strong>Exchange:</strong> decide para qual fila cada mensagem vai. Tipo “Pedidos de sushi vão para cozinha japonesa”.</li>
                <li><strong>Binding:</strong> conexão entre Exchange e Fila. Define como as mensagens são entregues.</li>
            </ul>

            <h4 className="mt-4">🔄 Fluxo simplificado</h4>
            <ol className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>🧍‍♂️ Garçom (produtor) anota o pedido e coloca na fila de pedidos.</li>
                <li>🔀 Exchange decide para qual fila o pedido vai.</li>
                <li>👨‍🍳 Cozinheiro (consumidor) pega o pedido da fila e prepara a comida.</li>
                <li>🍽 Quando pronto, garçom entrega o pedido ao cliente.</li>
            </ol>

            <h4 className="mt-4">📌 Tipos de Exchange</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li><strong>Direct:</strong> mensagem vai para a fila certa baseada em uma chave específica. Ex: “Sushi → cozinha japonesa”.</li>
                <li><strong>Fanout:</strong> mensagem enviada para todas as filas. Ex: anúncio geral de novos pedidos.</li>
                <li><strong>Topic:</strong> mensagens vão para filas com base em padrões de tópicos. Ex: “bebidas.*” vai para todas as filas de bebidas.</li>
                <li><strong>Headers:</strong> mensagens vão para filas baseado em informações extras (cabeçalhos), como prioridade ou tipo de cliente.</li>
            </ul>

            <h4 className="mt-4">💡 Benefícios</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li><strong>Desacoplamento:</strong> Produtor e consumidor não precisam se conhecer.</li>
                <li><strong>Escalabilidade:</strong> Pode aumentar o número de consumidores sem mudar o produtor.</li>
                <li><strong>Resiliência:</strong> Mensagens ficam na fila até serem processadas.</li>
                <li><strong>Controle de fluxo:</strong> Evita sobrecarga, processando apenas o que o consumidor consegue.</li>
            </ul>
        </div>
    );
}
