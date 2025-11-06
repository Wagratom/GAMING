import { IoIosReturnLeft } from "react-icons/io";

export default function SOLIDArticle({ closeEstudo }: { closeEstudo: (e: any, name: string) => void }) {
    return (
        <div
            className="solid-article p-4"
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
                <h1 className="text-center w-100" style={{ color: "#a3e635" }}>Princípios SOLID</h1>
            </div>

            <p className="mt-3">
                Se você já possui alguma experiência, provavelmente já aplica os princípios do <strong>SOLID</strong> sem nem perceber. Mas afinal, o que é SOLID?
            </p>
            <p className="mt-3">
                O <strong>SOLID</strong> é um conjunto de boas práticas da <strong>programação orientada a objetos</strong>, criado para garantir que o código seja <strong>limpo, modular e fácil de manter</strong>.
                Ele é um acrônimo que representa cinco princípios fundamentais:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2">
                <li><strong>S</strong> – Single Responsibility (Responsabilidade Única)</li>
                <li><strong>O</strong> – Open/Closed (Aberto/Fechado)</li>
                <li><strong>L</strong> – Liskov Substitution (Substituição de Liskov)</li>
                <li><strong>I</strong> – Interface Segregation (Segregação de Interface)</li>
                <li><strong>D</strong> – Dependency Inversion (Inversão de Dependência)</li>
            </ul>

            <h4 className="mt-4">S – Single Responsibility (Responsabilidade Única)</h4>
            <p>
                Tanto as <strong>classes</strong> quanto os <strong>métodos</strong> devem ter <strong>uma única responsabilidade</strong>. Isso significa que cada um deve se concentrar em <strong>fazer uma única coisa bem feita</strong>, facilitando o entendimento, os testes e a manutenção do código.
            </p>
            <p>
                <strong>Exemplo:</strong> Imagine que precisamos gerar relatórios e depois enviá-los por e-mail. Se aplicarmos o Single Responsibility, teremos:
            </p>
            <ul className="list-disc list-inside ml-4">
                <li>Uma classe responsável por gerar relatórios</li>
                <li>Outra classe responsável por enviar e-mails</li>
            </ul>
            <p>
                Por quê? Porque assim, se houver um erro na geração dos relatórios, sabemos exatamente em qual classe investigar. E se o envio de e-mails falhar, o serviço de relatórios continuará funcionando normalmente. Além disso, facilita a criação de microsserviços no futuro.
                Com isso, desacoplamos e deixamos resiliante a falhas, facil manutenção...
            </p>
            <p>
                O mesmo vale para os métodos. Não faz sentido colocar toda a geração de um relatório em uma única função gigante. Podemos quebrar em etapas menores:
            </p>
            <ul className="list-disc list-inside ml-4">
                <li><code>ConsumerData()</code></li>
                <li><code>ProcessData()</code></li>
                <li><code>GenerateHeaders()</code></li>
                <li><code>GenereteRelatorio()</code></li>
            </ul>
            <p>
                Cada método tem um papel claro, o código fica mais legível e mais fácil de manter.
            </p>

            <h4 className="mt-4">O – Open/Closed (Aberto/Fechado)</h4>
            <p className="mt-3">
                O <strong>Open/Closed Principle</strong> diz que <strong>uma classe deve estar aberta para extensão, mas fechada para modificação</strong>.
                Isso significa que podemos adicionar novos comportamentos sem precisar alterar o código que já funciona.
                Por quê? Porque isso reduz a chance de quebrar alguma funcionalidade existente.
                Se o seu aplicativo não tiver uma boa cobertura de testes, a probabilidade de gerar um bug ao mexer em uma feature já existente é altíssima.
            </p>
            <p className="mt-3">
                <strong>Exemplo prático:</strong> Imagine uma calculadora de descontos. Inicialmente, temos descontos de promoção e cupom:
            </p>

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
                }}>

                {`class CalculadoraDeDescontos {
    public double calcular(String tipo) {
        if (tipo.equals("PROMOCAO")) return 0.1;
        else if (tipo.equals("CUPOM")) return 0.2;
        return 0;
    }
}`}
            </pre>
            <p>
                Cada vez que adicionamos um novo tipo de desconto, precisaríamos atualizar essa classe, correndo o risco de quebrar algum disconto ja existente.
                Com Open/Closed, usamos abstrações e polimorfismo:
            </p>
            <pre
                className="mt-3"
                style={{
                    background: "#27293d",
                    padding: "16px",
                    borderRadius: "8px",
                    color: "#a3e635",
                    whiteSpace: "pre", // <-- mantém as quebras e espaçamentos!
                    fontFamily: "monospace",
                    display: "table"
                }}>

                {`interface Desconto {
    double calcular();
}

class DescontoPromocao implements Desconto {
    public double calcular() { return 0.1; }
}

class DescontoCupom implements Desconto {
    public double calcular() { return 0.2; }
}

class NovoDesconto implements Desconto {
    public double calcular() { return 0.4; }
}`}
            </pre>
            <p>
                Assim, para adicionar um novo desconto, criamos apenas uma nova classe que implementa <code>Desconto</code>. O código existente continua funcionando perfeitamente.
            </p>
            <p>
                ✅ Benefícios: código mais seguro, fácil de evoluir e ideal para sistemas grandes, onde pequenas mudanças podem ter grandes impactos.
            </p>


            <h4 className="mt-4">L — Liskov Substitution Principle</h4>
            <p>
                O <strong>Liskov Substitution Principle</strong> diz que <strong>as classes derivadas devem poder substituir suas classes base sem alterar o comportamento do programa</strong>.
                Isso quer dizer que, se você tem uma classe filha herdando de uma classe pai, ela deve funcionar perfeitamente onde quer que a classe pai seja usada.
                Se ao trocar uma instância da classe base por uma derivada algo quebra, então há uma violação desse princípio.
            </p>

            <p className="mt-3">
                💡 <strong>Exemplo simples:</strong><br />
                Imagine que temos uma classe <code>Pássaro</code> que tem o método <code>voar()</code>.
                Agora criamos uma classe <code>Pinguim</code> que herda de <code>Pássaro</code>.
                O problema é que pinguins <strong>não voam</strong> — então, se tentarmos chamar <code>voar()</code> em um pinguim, o programa quebra ou faz algo sem sentido.
            </p>

            <p className="mt-3">
                Nesse caso, o <strong>pinguim não deveria herdar de pássaro</strong> diretamente, pois ele não respeita o comportamento esperado da classe base.
                Uma solução melhor seria ter uma classe mais genérica, como <code>Ave</code>, e só as aves que realmente voam herdariam de <code>AveVoadora</code>.
                Assim, cada tipo respeita o comportamento que promete.
            </p>

            <p className="mt-3">
                Esse princípio ajuda a manter o código previsível e fácil de entender, evitando que heranças mal planejadas causem erros difíceis de identificar.
                O polimorfismo, por si só, já é um conceito um pouco complexo para quem está começando, e se for mal utilizado, pode deixar o código confuso e sujeito a falhas.
            </p>



            <h4 className="mt-4">4. I — Interface Segregation Principle (Princípio da Segregação de Interfaces)</h4>
            <p className="mt-3">
                Como vimos acima, o princípio de Liskov fala sobre manter o comportamento das classes filhas
                perfeitamente alinhado ao da classe pai. O <strong>Interface Segregation Principle</strong> vai além:
                ele fala sobre <strong>não forçar as classes filhas a implementar métodos que elas não precisam</strong>.
            </p>

            <p className="mt-3">
                Quando criamos uma interface muito genérica, as classes que a implementam podem acabar
                com métodos que não fazem sentido para elas, apenas para “cumprir contrato”.
                Isso quebra a ideia de responsabilidade clara e aumenta o acoplamento do sistema.
            </p>

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
                {`interface Trabalhador {
    void programar();
    void desenhar();
}

class Engenheiro implements Trabalhador {
    public void programar() { ... }
    public void desenhar() {
        // 🤔 Não faz sentido, engenheiro não necessariamente desenha
    }
}

// Correto seria separar:
interface Programador {
    void programar();
}

interface Designer {
    void desenhar();
}`}
            </pre>

            <p className="mt-3">
                Assim, cada classe implementa apenas o que realmente precisa, tornando o código mais limpo,
                coeso e fácil de evoluir.
            </p>



            <h4 className="mt-4">5. D — Dependency Inversion Principle (Princípio da Inversão de Dependência)</h4>

            <p>
                E por último, o <strong>Dependency Inversion Principle</strong>.
                Esse princípio é mais voltado para <strong>arquitetura de camadas</strong> e diz que
                <strong> as camadas inferiores não devem depender diretamente das camadas superiores</strong>.
            </p>

            <p className="mt-3">
                Ou seja, ao invés de uma classe depender diretamente de outra,
                elas se comunicam por meio de <strong>interfaces</strong> ou <strong>contratos</strong>.
                Em resumo, é o princípio da <strong>inversão de dependências</strong>.
            </p>

            <p className="mt-3">
                Esse princípio torna o sistema mais <strong>flexível</strong>, <strong>testável</strong> e <strong>desacoplado</strong>.
                Como a aplicação depende do contrato e não da classe em si, podemos trocar implementações
                sem alterar a lógica principal.
            </p>

            <p className="mt-3">
                Por exemplo, pense em um <code>Repository</code>.
                Se a sua aplicação depende apenas de uma interface (um contrato),
                você pode mudar o banco de dados a qualquer momento — seja <strong>PostgreSQL</strong>,
                <strong> MySQL</strong> ou outro — sem precisar alterar o restante do código.
                O importante é que o novo banco implemente o mesmo contrato esperado pela aplicação.
            </p>

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
                {`interface UserRepository {
    User findById(String id);
}

class PostgresUserRepository implements UserRepository {
    public User findById(String id) { ... }
}

class MySQLUserRepository implements UserRepository {
    public User findById(String id) { ... }
}

// A camada de serviço só depende da interface:
class UserService {
    private UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public void buscarUsuario(String id) {
        return repository.findById(id);
    }
}`}
            </pre>

            <p className="mt-3">
                Assim, a camada de serviço continua funcionando normalmente,
                independentemente de qual banco de dados esteja sendo usado.
                Isso é o que torna o código <strong>desacoplado e preparado para mudanças</strong>.
            </p>

        </div>
    );
}
