import { IoIosReturnLeft } from "react-icons/io";

export default function SpringBootArticle({ closeEstudo }: { closeEstudo: (e: any, name: string) => void }) {
    return (
        <div
            className="springboot-article p-4"
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
                <h1 className="text-center w-100" style={{ color: "#a3e635" }}>🌱 O que é Spring Boot?</h1>
            </div>

            <p className="mt-3">
                O <strong>Spring Boot</strong> é uma extensão do <strong>Spring Framework</strong> que facilita a criação de aplicações Java,
                especialmente web e APIs REST.
            </p>

            <p className="mt-3">
                Mas o que é o <strong>Spring Framework</strong>? Ele é um framework para Java que ajuda a construir aplicações
                robustas, modulares e fáceis de manter. Ele oferece componentes prontos para coisas como:
            </p>

            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>Conexão com banco de dados</li>
                <li>Transações</li>
                <li>Injeção de dependência</li>
                <li>Gerenciamento de threads</li>
                <li>Segurança</li>
            </ul>

            <p className="mt-3">
                Imagine que você vai montar um carro: ao invés de fabricar todas as peças do zero, você compra rodas, volante, motor e monta do jeito que deseja.
                É exatamente isso que o Spring faz para aplicações Java.
            </p>

            <p className="mt-3">
                O Spring Boot não é um framework novo, mas uma abstração que simplifica a configuração do Spring,
                permitindo que você foque na lógica do seu sistema sem se preocupar com detalhes de setup.
            </p>

            <h4 className="mt-4">Principais características:</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>⚡ <strong>Autoconfiguração:</strong> configura automaticamente muitos componentes do Spring.</li>
                <li>🌐 <strong>Servidor embutido:</strong> não precisa instalar Tomcat ou outro servidor.</li>
                <li>📦 <strong>Dependências simplificadas:</strong> basta adicionar "starters" para funcionalidades como web, banco, segurança.</li>
                <li>🚀 <strong>Pronto para produção:</strong> inclui métricas, monitoramento e logging.</li>
            </ul>

            <h4 className="mt-4">💡 Exemplo: Spring vs Spring Boot</h4>

            <p className="mt-2">
                Antes do Spring Boot, criar uma API REST exigia configurar Tomcat, beans, datasources e mapeamentos manualmente:
            </p>

            <pre
                className="mt-2"
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
{`@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "com.exemplo")
public class AppConfig {
    @Bean
    public UsuarioService usuarioService() { return new UsuarioService(); }

    @Bean
    public UsuarioController usuarioController() { return new UsuarioController(usuarioService()); }
}`}
            </pre>

            <p className="mt-2">
                Com Spring Boot, tudo isso é simplificado. Basta criar a classe principal e um controller:
            </p>

            <pre
                className="mt-2"
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
{`@SpringBootApplication
public class MeuApp {
    public static void main(String[] args) {
        SpringApplication.run(MeuApp.class, args);
    }
}

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    @GetMapping
    public List<String> listarUsuarios() {
        return List.of("Alice", "Bob", "Carol");
    }
}`}
            </pre>

            <h4 className="mt-4">🔑 Benefícios do Spring Boot</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>🚀 Produtividade: menos configuração, mais foco na lógica do negócio.</li>
                <li>⚡ Escalabilidade: fácil criar APIs que crescem sem complexidade.</li>
                <li>🧪 Testabilidade: integração fácil com Spring Test, MockMvc, JUnit.</li>
                <li>🔗 Integração rápida: conecte bancos, filas e serviços externos com “starters”.</li>
                <li>🛠 Autonomia: servidor embutido permite rodar com `java -jar` sem instalar nada.</li>
            </ul>
        </div>
    );
}
