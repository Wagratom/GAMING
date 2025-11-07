import { IoIosReturnLeft } from "react-icons/io";

export default function SpringSecurityArticle({ closeEstudo }: { closeEstudo: (e: any, name: string) => void }) {
    return (
        <div
            className="spring-security-article p-4"
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
                <h1 className="text-center w-100" style={{ color: "#a3e635" }}>Spring Security</h1>
            </div>

            <p className="mt-3">
                O <strong>Spring Security</strong> é um módulo do Spring Framework que adiciona <strong>segurança às aplicações Java</strong>.
                Ele cuida de autenticação, autorização e proteção contra ataques comuns da web, como CSRF ou session fixation.
            </p>

            <p className="mt-3">
                Ele é usado tanto em aplicações web quanto em APIs REST. Ou seja, qualquer lugar onde você precise garantir que apenas usuários autorizados possam acessar certos recursos.
            </p>

            <h4 className="mt-4">🔑 Principais funções</h4>
            <ul style={{ paddingLeft: "20px" }}>
                <li>🛡 <strong>Autenticação:</strong> identificar o usuário (login, senha, OAuth2, JWT, LDAP, etc).</li>
                <li>🔐 <strong>Autorização:</strong> controlar quem pode acessar o quê (roles, permissões, endpoints).</li>
                <li>🛡️ <strong>Proteção contra ataques:</strong> CSRF, XSS, brute force, session fixation.</li>
                <li>🔗 <strong>Integração com APIs:</strong> proteger endpoints REST usando tokens ou sessões.</li>
            </ul>

            <h4 className="mt-4">💡 Exemplo simplificado</h4>
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
{`@RestController
@RequestMapping("/tarefas")
public class TarefaController {

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Tarefa> listarTarefas() {
        return tarefaService.listarTodas();
    }
}`}
            </pre>
            <p className="mt-3">
                Nesse exemplo, apenas usuários com a role <strong>ADMIN</strong> podem acessar o endpoint <code>/tarefas</code>.
                O Spring Security verifica o token ou a sessão antes de liberar o acesso.
            </p>

            <h4 className="mt-4">🔄 Autenticação com JWT ou OAuth2</h4>
            <p className="mt-3">
                O Spring Security é compatível com <strong>JWT</strong> e <strong>OAuth2</strong>, permitindo validar tokens recebidos do cliente, extrair informações do usuário (como ID, roles e permissões) e proteger endpoints de APIs REST sem precisar de sessões no servidor (stateless).
            </p>

            <h4 className="mt-4">⚠️ Pontos de atenção</h4>
            <ul style={{ paddingLeft: "20px" }}>
                <li>⚙️ Configuração inicial: poderoso, mas precisa ser configurado corretamente.</li>
                <li>🛡 Segurança de APIs: sempre use HTTPS e valide tokens corretamente.</li>
                <li>🔧 Customizações: filtros e regras próprias são possíveis, mas cuidado para não quebrar o fluxo de autenticação.</li>
            </ul>
        </div>
    );
}
