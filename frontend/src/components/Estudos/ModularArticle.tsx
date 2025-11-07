import { IoIosReturnLeft } from "react-icons/io";

export default function ModularArticle({ closeEstudo }: { closeEstudo: (e: any, name: string) => void }) {
    return (
        <div
            className="modular-article p-4"
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
                <h1 className="text-center w-100" style={{ color: "#a3e635" }}>Modular Monolith</h1>
            </div>

            <p>
                O <strong>Modular Monolith</strong> é uma abordagem para organizar aplicações monolíticas em módulos bem definidos,
                cada um com responsabilidades claras, mas ainda assim deployado como um único bloco.
            </p>

            <h4 className="mt-3">🔹 Características principais</h4>
            <ul style={{ paddingLeft: "20px" }}>
                <li>Organização por módulos internos, facilitando manutenção e testes.</li>
                <li>Deploy único, mas cada módulo pode evoluir sem impactar diretamente os outros.</li>
                <li>Facilidade de transição futura para microserviços, caso seja necessário.</li>
            </ul>

            <h4 className="mt-3">💡 Exemplos práticos</h4>
            <ul style={{ paddingLeft: "20px" }}>
                <li>
                    Uma aplicação de e-commerce: módulos separados para <strong>Catálogo de Produtos</strong>, <strong>Pedidos</strong> e <strong>Pagamentos</strong>, mas todos deployados juntos.
                </li>
                <li>
                    Sistema de blog: módulos internos para <strong>Posts</strong>, <strong>Comentários</strong> e <strong>Usuários</strong>, mantendo o monólito organizado.
                </li>
                <li>
                    Plataforma de streaming: módulos para <strong>Gerenciamento de Vídeos</strong>, <strong>Assinaturas</strong> e <strong>Notificações</strong>.
                </li>
            </ul>

            <h4 className="mt-3">✅ Benefícios</h4>
            <ul style={{ paddingLeft: "20px" }}>
                <li>Organização de código sem perder simplicidade do monólito.</li>
                <li>Facilidade de testes e manutenção por módulo.</li>
                <li>Base sólida para futura migração a microserviços.</li>
            </ul>

            <h4 className="mt-3">⚠️ Pontos de atenção</h4>
            <ul style={{ paddingLeft: "20px" }}>
                <li>Continua sendo um deploy único, então escalabilidade ainda é limitada comparada a microserviços.</li>
                <li>Regras de dependência entre módulos devem ser bem definidas para não gerar acoplamento excessivo.</li>
            </ul>
        </div>
    );
}
