import { IoIosReturnLeft } from "react-icons/io";

export default function JwtArticle({ closeEstudo }: { closeEstudo: (e: any, name: string) => void }) {
    return (
        <div
            className="jwt-article p-4"
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
                <h1 className="text-center w-100" style={{ color: "#a3e635" }}>O que é JWT?</h1>
            </div>

            <p className="mt-2">
                <strong>JWT (JSON Web Token)</strong> é um método muito usado para <strong>autenticação</strong> e troca segura de informações entre sistemas.
                Na prática, é um <em>token</em> — uma string — que contém um JSON <strong>codificado</strong> em Base64URL e <strong>assinado</strong>, permitindo que o servidor
                confirme a autenticidade dos dados sem precisar manter sessão na memória.
            </p>

            <h4 className="mt-4">Resumo rápido</h4>
            <p className="mt-2">
                Em poucas palavras: o JWT é um JSON codificado em <code>Base64URL</code> transformado em string. Ele <strong>comprova</strong> que o usuário está autenticado
                sem que o servidor precise guardar informações de sessão — por isso chamamos isso de <strong>autenticação stateless</strong>.
            </p>

            <h4 className="mt-4">Por que usamos JWT?</h4>
            <p className="mt-2">
                Antes do JWT, muitos sistemas usavam <strong>session IDs</strong>, ou seja: quando o usuário fazia login, o servidor criava uma sessão e guardava dados na memória
                ou no banco (ex.: configurações, carrinho, estado do chat). Isso força o servidor a <strong>lembrar</strong> de cada usuário.
            </p>
            <p className="mt-2">
                O problema aparece quando você tem <strong>múltiplas instâncias</strong> da aplicação (Servidor 1, Servidor 2, ...). Se o usuário atualiza algo no Servidor 1,
                e depois a próxima requisição vai para o Servidor 2, esse segundo pode não ter acesso àquela informação (depedendo da maneira que foi desenvolvida) — causando perda de estado ou inconsistências.
            </p>

            <h4 className="mt-4">Como o JWT resolve isso</h4>
            <p className="mt-2">
                O JWT contém tudo que o servidor precisa saber (ID do usuário, permissões, expiração, etc.) e vem <strong>assinado</strong>. Assim:
            </p>
            <ul className="list-disc list-inside ml-4">
                <li>O servidor <strong>não precisa guardar estado</strong> — basta validar o token em cada requisição.</li>
                <li>A assinatura garante que ninguém alterou o conteúdo do token.</li>
                <li>Fica simples escalar para múltiplas instâncias e microsserviços.</li>
            </ul>

            <h4 className="mt-4">Estrutura do JWT</h4>
            <p className="mt-2">
                Um JWT tem três partes separadas por pontos:
            </p>
            <pre
                className="mt-3"
                style={{
                    background: "#27293d",
                    padding: "12px",
                    borderRadius: "8px",
                    color: "#a3e635",
                    whiteSpace: "pre",
                    fontFamily: "monospace",
                    display: "table",
                    margin: 0,
                }}
            >
                {`HEADER.PAYLOAD.SIGNATURE

Exemplo:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjMiLCJuYW1lIjoiQmFua2FpIiwicm9sZSI6ImFkbWluIn0.
TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ`}
            </pre>

            <p className="mt-2">
                <strong>Header</strong>: metadados (ex.: algoritmo). <br />
                <strong>Payload</strong>: as <em>claims</em> — informações que você quer transportar (ID, role, exp). <br />
                <strong>Signature</strong>: assinatura criptográfica sobre header+payload (garante integridade).
            </p>

            <h4 className="mt-4">Fluxo típico (prático)</h4>
            <ol className="mt-2">
                <li>
                    <strong>Login:</strong> o usuário envia credenciais (email/senha) para a API.
                </li>
                <li>
                    <strong>Gerar token:</strong> o servidor valida credenciais e gera um JWT com informações (payload) e assinatura.
                </li>
                <li>
                    <strong>Enviar ao cliente:</strong> o cliente armazena o token (ex.: localStorage, cookie seguro).
                </li>
                <li>
                    <strong>Requisições futuras:</strong> o cliente manda o token no header: <code>Authorization: Bearer &lt;token&gt;</code>.
                </li>
                <li>
                    <strong>Validação:</strong> o servidor valida assinatura e expiração; se OK, extrai as claims e autoriza a ação.
                </li>
            </ol>

            <h4 className="mt-4">Pontos importantes e boas práticas</h4>
            <ul className="list-disc list-inside ml-4">
                <li>
                    <strong>Não é criptografia:</strong> o payload é codificado (Base64URL), não criptografado — qualquer um pode decodar e ver o conteúdo.
                </li>
                <li>
                    <strong>Assinatura importa:</strong> a assinatura impede que um atacante modifique o token sem ser detectado.
                </li>
                <li>
                    <strong>Use exp curta:</strong> tokens com tempo de vida curto reduzem o impacto caso um token vaze.
                </li>
                <li>
                    <strong>Refresh Tokens:</strong> combine access tokens curtos com refresh tokens (armazenados com mais segurança) para renovar sessões.
                </li>
                <li>
                    <strong>Onde guardar no cliente:</strong> cookies HTTP-only são mais seguros contra XSS; localStorage é prático, mas mais vulnerável.
                </li>
                <li>
                    <strong>Revogação:</strong> por ser stateless, você não “mata” um token facilmente — se precisar, mantenha uma blacklist ou controle por versão (ex.: tokenVersion).
                </li>
                <li>
                    <strong>Algoritmos fortes:</strong> prefira HS256 ou RS256 com chaves bem gerenciadas.
                </li>
            </ul>

            <h4 className="mt-4">Exemplo visual rápido (payload)</h4>
            <pre
                className="mt-3"
                style={{
                    background: "#27293d",
                    padding: "12px",
                    borderRadius: "8px",
                    color: "#a3e635",
                    whiteSpace: "pre-wrap",
                    fontFamily: "monospace",
                    margin: 0,
                    display: "table",
                }}
            >
                {`{
  "sub": "1234567890",   // id do usuário
  "name": "Bankai",
  "role": "admin",
  "iat": 1615159071,     // issued at
  "exp": 1615162671      // expiration (timestamp)
}`}
            </pre>

        </div>
    );
}
