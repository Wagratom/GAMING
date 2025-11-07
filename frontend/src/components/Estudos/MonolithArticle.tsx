import { IoIosReturnLeft } from "react-icons/io";

export default function MonolithArticle({ closeEstudo }: { closeEstudo: (e: any, name: string) => void }) {
    return (
        <div
            className="monolith-article p-4"
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
                <h1 className="text-center w-100" style={{ color: "#a3e635" }}>O que é Monólito?</h1>
            </div>

            <p className="mt-3">
                <strong>Monólito</strong> é uma arquitetura de software onde toda a aplicação está unificada em um único sistema. 
                Todas as funcionalidades — como login, catálogo, carrinho, pagamento — ficam no mesmo projeto e compartilham o mesmo banco de dados.
            </p>

            <p className="mt-3">
                Em outras palavras, você tem “tudo junto”: o backend, a lógica de negócio e até a interface podem estar acoplados. 
                Isso facilita o início do desenvolvimento, mas pode gerar problemas quando a aplicação cresce.
            </p>

            <h4 className="mt-4">💡 Conceitos principais</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>🔹 <strong>Unidade única:</strong> toda a aplicação é um único projeto e deploy.</li>
                <li>🧩 <strong>Acoplamento:</strong> mudanças em uma parte da aplicação podem afetar outras partes.</li>
                <li>📦 <strong>Banco de dados único:</strong> todas as funcionalidades compartilham o mesmo armazenamento.</li>
            </ul>

            <h4 className="mt-4">🚀 Vantagens do Monólito</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>⚡ <strong>Simples de iniciar:</strong> bom para pequenas equipes ou projetos iniciais.</li>
                <li>🛠 <strong>Facilidade de depuração:</strong> tudo está no mesmo lugar.</li>
                <li>📦 <strong>Deploy único:</strong> você faz o build e deploy de tudo junto.</li>
            </ul>

            <h4 className="mt-4">⚠️ Pontos de atenção</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>📈 <strong>Escalabilidade limitada:</strong> não é possível escalar apenas uma parte da aplicação.</li>
                <li>🔗 <strong>Acoplamento alto:</strong> mudanças em um módulo podem gerar efeitos colaterais.</li>
                <li>⏱ <strong>Deploys mais arriscados:</strong> pequenas alterações exigem deploy de toda a aplicação.</li>
                <li>👥 <strong>Equipes maiores sofrem:</strong> muitos desenvolvedores trabalhando no mesmo código podem gerar conflitos.</li>
            </ul>

            <h4 className="mt-4">📦 Exemplo prático</h4>
            <p className="mt-2">
                Imagine um e-commerce monolítico:
            </p>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>🛒 Carrinho de compras</li>
                <li>📦 Estoque</li>
                <li>💳 Pagamentos</li>
                <li>👤 Usuários</li>
            </ul>
            <p className="mt-2">
                Todos os módulos estão no mesmo projeto e compartilham o mesmo banco de dados. Se houver algum problema em um módulo, 
                todo o sistema pode ser afetado.
            </p>
        </div>
    );
}
