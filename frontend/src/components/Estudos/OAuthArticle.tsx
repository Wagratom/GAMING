import { IoIosReturnLeft } from "react-icons/io";

export default function OAuthArticle({ closeEstudo }: { closeEstudo: (e: any, name: string) => void }) {
    return (
        <div
            className="oauth-article p-4"
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
                <h1 className="text-center w-100" style={{ color: "#a3e635" }}>O que é OAuth?</h1>
            </div>

            <p>
                O <strong>OAuth</strong> (Open Authorization) é um padrão aberto de autorização que permite que um aplicativo
                acesse recursos de outro serviço <strong>sem precisar das credenciais do usuário</strong> (como login e senha).
            </p>

            <p className="mt-3">
                Em vez de pedir usuário e senha diretamente, o aplicativo solicita <strong>permissão de acesso</strong> por meio
                de um <strong>token temporário</strong> — emitido por um provedor de autenticação como o Google, Spotify ou GitHub.
            </p>

            <p className="mt-3">
                <strong>Em resumo:</strong> com o OAuth, você autoriza um app a agir em seu nome — sem precisar entregar sua senha.
            </p>

            <h4 className="mt-4">Exemplo prático</h4>

            <p className="mt-1">
                Imagine que você está visitando uma empresa e recebe um <strong>cartão temporário de visitante</strong>. Esse cartão
                tem validade limitada e permite acesso apenas a certas áreas — diferente do crachá de um funcionário.
            </p>

            <p className="mt-3">
                O OAuth funciona da mesma forma. Quando você faz login em um site usando, por exemplo, o <strong>LinkedIn</strong>,
                aparece um aviso dizendo:
            </p>

            <div style={{ background: "#2c2c44", padding: "10px", borderRadius: "8px", margin: "10px 0" }}>
                <p>
                    “O aplicativo <em>X</em> deseja acessar suas informações <em>Y</em> — deseja permitir?”
                </p>
            </div>

            <p className="mt-3">
                Se você aceitar, o LinkedIn gera um <strong>token de acesso</strong> e o envia ao site. Esse token é usado
                para acessar algumas informações suas (como nome e e-mail), mas sem precisar compartilhar sua senha.
            </p>

            <div style={{ background: "#422", padding: "10px", borderRadius: "8px", margin: "10px 0", color: "#ffb3b3" }}>
                ⚠️ <strong>Atenção:</strong> dependendo das permissões concedidas, o app pode <strong>ler, atualizar ou excluir</strong> dados
                em seu nome. Por isso, sempre revise o que está autorizando.
            </div>

            <h4 className="mt-4">Como o fluxo funciona (resumidamente)</h4>
            <p className="mt-1">
                O fluxo mais comum é o <strong>Authorization Code Flow</strong>, utilizado em aplicações web seguras:
            </p>

            <div style={{ background: "#2c2c44", padding: "12px", borderRadius: "8px", margin: "12px 0" }}>
                <p>
                    <strong>Usuário → App Cliente → Servidor de Autorização → Token → API Protegida</strong>
                </p>
            </div>

            <ul className="mt-3">
                <li>🧍‍♂️ <strong>Usuário tenta logar</strong> — clica em “Entrar com Google” ou “Entrar com LinkedIn”.</li>
                <li className="mt-2">🌐 <strong>O site redireciona o usuário</strong> para o provedor OAuth pedindo autorização.</li>
                <li className="mt-2">✅ <strong>O usuário permite o acesso</strong> — confirmando que o app pode ler certas informações.</li>
                <li className="mt-2">📩 <strong>O provedor retorna um “Authorization Code”</strong> para o site via callback.</li>
                <li className="mt-2">🔄 <strong>O site troca o “code” por um “Access Token”</strong> (e às vezes um “Refresh Token”).</li>
                <li className="mt-2">🔐 <strong>O site usa o Access Token</strong> para acessar dados protegidos — sem precisar da senha.</li>
            </ul>

            <h4 className="mt-4">🔒 E o PKCE?</h4>
            <p className="mt-1">
                O <strong>PKCE</strong> (Proof Key for Code Exchange) é uma camada extra de segurança no <strong>OAuth 2.0</strong>,
                usada principalmente em aplicativos frontend (SPA ou mobile).
            </p>
            <p className="mt-3">
                Ele evita que um invasor roube o código de autorização interceptando o redirecionamento.
                Em resumo, o PKCE faz o app <strong>provar que foi ele mesmo quem iniciou o login</strong>.
            </p>

            {/* 🔽 NOVA SEÇÃO: DIFERENÇAS ENTRE OAUTH 1.0 E 2.0 */}
            <h4 className="mt-4">⚙️ Diferenças entre OAuth 1.0 e OAuth 2.0</h4>
            <p className="mt-2">
                O <strong>OAuth 2.0</strong> é a versão mais moderna e amplamente usada do protocolo. 
                Ele trouxe melhorias significativas em <strong>segurança</strong>, <strong>simplicidade</strong> e <strong>suporte a diversos tipos de aplicação</strong>.
            </p>

            <ul className="mt-3" style={{ paddingLeft: "20px" }}>
                <li>🧠 <strong>OAuth 1.0:</strong> usava assinaturas criptográficas complexas e era difícil de implementar.</li>
                <li className="mt-2">🚀 <strong>OAuth 2.0:</strong> usa HTTPS e tokens de acesso simples, muito mais fácil de usar.</li>
                <li className="mt-2">📱 <strong>Suporte ampliado:</strong> o 2.0 é compatível com web, mobile e APIs.</li>
                <li className="mt-2">⚡ <strong>Padrão atual:</strong> é o protocolo usado por Google, GitHub, Spotify e LinkedIn.</li>
            </ul>

            <h4 className="mt-4">✅ Vantagens do OAuth</h4>
            <ul style={{ paddingLeft: "20px" }}>
                <li>🔐 <strong>Segurança:</strong> senhas nunca são compartilhadas com apps terceiros.</li>
                <li>🔄 <strong>Escalabilidade:</strong> o mesmo login pode ser usado em múltiplos aplicativos.</li>
                <li>🧩 <strong>Integração:</strong> ideal para conectar APIs externas (Google, Spotify, GitHub, etc).</li>
                <li>⏱ <strong>Tokens com tempo de vida limitado:</strong> reduzem o impacto em caso de vazamento.</li>
            </ul>
        </div>
    );
}
