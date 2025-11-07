import { IoIosReturnLeft } from "react-icons/io";

export default function SessionArticle({ closeEstudo }: { closeEstudo: (e: any, name: string) => void }) {
    return (
        <div
            className="session-article p-4"
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
                <h1 className="text-center w-100" style={{ color: "#a3e635" }}>Session-Based Authentication</h1>
            </div>

            <p className="mt-3">
                <strong>Session-based authentication</strong> é o modelo clássico de autenticação usado por muitos sites tradicionais.
                Quando o usuário faz login, o servidor cria uma <strong>sessão</strong> e guarda dados dessa sessão (em memória, banco ou cache).
                O backend retorna um <strong>cookie</strong> com um <em>session id</em> que identifica essa sessão nas próximas requisições.
            </p>

            <h4 className="mt-3">Fluxo resumido</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>🧾 <strong>Login:</strong> usuário envia credenciais (email/senha) ao servidor.</li>
                <li>🔑 <strong>Servidor cria a sessão:</strong> gera um session id e armazena dados (ex.: userId, roles).</li>
                <li>🍪 <strong>Cookie:</strong> o servidor envia um cookie com o session id para o cliente.</li>
                <li>🔁 <strong>Requisições futuras:</strong> o navegador inclui o cookie automaticamente nas requisições ao mesmo domínio.</li>
                <li>🔍 <strong>Validação:</strong> o servidor consulta a sessão pelo id e autoriza o acesso conforme os dados armazenados.</li>
            </ul>

            <h4 className="mt-3">Prós</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>✅ Simples de implementar em apps server-rendered (ex.: apps com templates).</li>
                <li>✅ Fácil controle e revogação — basta invalidar a sessão no servidor.</li>
                <li>✅ Cookies podem ser configurados como <code>HttpOnly</code> e <code>Secure</code> para mitigar XSS e enviar apenas via HTTPS.</li>
            </ul>

            <h4 className="mt-3">Contras / pontos de atenção</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li className="mt-2">
                    ⚙️ <strong>Escalabilidade:</strong> hoje em dia, quase todas as aplicações utilizam uma arquitetura escalável — ou seja,
                    existem vários servidores de backend rodando ao mesmo tempo.
                    Se a sessão for salva apenas na memória de um servidor, quando o usuário cair em outro servidor, ele “perde” o login.
                    Por isso, é necessário ter um ponto de armazenamento central (como um banco ou Redis) que todos os servidores possam acessar.
                    Outra opção é configurar o balanceador de carga para sempre enviar o mesmo usuário ao mesmo servidor.
                </li>

                <li className="mt-3">
                    🧱 <strong>Estado no servidor:</strong> como as sessões são guardadas no servidor, o backend precisa manter um
                    “estado” de quem está logado. Isso vai contra o conceito de aplicações <strong>stateless</strong> (sem estado),
                    que são mais simples de escalar e mais usadas em APIs modernas.
                </li>

                <li className="mt-3">
                    ⚠️ <strong>CSRF (Cross-Site Request Forgery):</strong> aplicações que usam cookies precisam tomar cuidado
                    com ataques onde outro site tenta usar o seu cookie de sessão sem permissão.
                    <br /><br />
                    🧩 Para se proteger, usamos algumas configurações importantes nos cookies:
                    <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                        <li className="mt-2">
                            <strong>SameSite:</strong> é uma configuração que define se o cookie pode ser enviado quando a requisição
                            vem de outro site.
                            <br />Por exemplo, se o seu sistema está em <code>meusite.com</code> e um invasor cria um site falso em <code>malicioso.com</code>,
                            o navegador <strong>não enviará o cookie</strong> se o <code>SameSite</code> estiver ativado.
                            Isso evita que outro domínio use sua sessão.
                            <br /><br />
                            Existem três modos principais:
                            <ul style={{ paddingLeft: "20px" }}>
                                <li><strong>Strict:</strong> o cookie só é enviado se o usuário estiver navegando no mesmo domínio (mais seguro).</li>
                                <li><strong>Lax:</strong> permite o envio em alguns casos, como cliques em links (equilíbrio entre segurança e usabilidade).</li>
                                <li><strong>None:</strong> o cookie é enviado sempre, mesmo de outros sites — deve ser usado apenas com <code>Secure</code>.</li>
                            </ul>
                        </li>

                        <li className="mt-3">
                            <strong>HttpOnly:</strong> impede que o cookie seja acessado via JavaScript (por exemplo, com <code>document.cookie</code>).
                            <br />Isso é importante porque, se um invasor conseguir injetar código (ataque XSS),
                            ele não poderá roubar o cookie de sessão do usuário.
                        </li>
                    </ul>
                </li>

            </ul>

            <h4 className="mt-3">Boas práticas</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>🔒 Use cookies <code>HttpOnly</code> e <code>Secure</code> para evitar leitura por JavaScript e exigir HTTPS.</li>
                <li>🕒 Defina expiração adequada na sessão e implemente logout que invalida a sessão no servidor.</li>
                <li>⚡ Em ambientes com múltiplas instâncias, use um storage compartilhado (ex.: Redis) em vez de memória local.</li>
                <li>🛡 Proteja contra CSRF (tokens ou SameSite) e valide origem dos requests sensíveis.</li>
            </ul>

            <h4 className="mt-3">Quando usar Session-Based</h4>
            <p className="mt-2">
                É uma ótima escolha para aplicações server-rendered (por exemplo, páginas com backend que retorna HTML) e quando você precisa
                ter controle centralizado sobre sessões do usuário (revogação imediata, auditoria, etc.).
            </p>

            <h4 className="mt-3">Resumo rápido</h4>
            <p className="mt-2">
                Session-based é simples, seguro (quando bem configurado) e fácil de revogar — porém exige gerenciamento de estado no servidor e
                atenção extra para escalabilidade e CSRF. Em arquiteturas modernas (APIs + SPAs) muitas equipes optam por tokens (JWT + OAuth) por conta do
                modelo stateless e facilidade de escalar, mas sessões ainda fazem muito sentido dependendo do caso.
            </p>
        </div>
    );
}
