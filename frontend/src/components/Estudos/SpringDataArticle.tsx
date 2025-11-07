import { IoIosReturnLeft } from "react-icons/io";

export default function SpringDataArticle({ closeEstudo }: { closeEstudo: (e: any, name: string) => void }) {
    return (
        <div
            className="springdata-article p-4"
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
                <h1 className="text-center w-100" style={{ color: "#a3e635" }}>Spring Data JPA</h1>
            </div>

            <p className="mt-3">
                <strong>Spring Data JPA</strong> é um módulo do Spring que simplifica o acesso a bancos de dados relacionais.
                Ele oferece uma camada de abstração sobre o <strong>JPA (Java Persistence API)</strong>, eliminando boa parte do código
                boilerplate (codigo repetitivo, gets, sets...) necessário para interagir com o banco de dados.
            </p>

            <h4 className="mt-3">Como funciona</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>🧩 <strong>JPA</strong> é apenas uma <em>especificação</em> — define interfaces e regras para persistência de dados.</li>
                <li>⚙️ O <strong>Hibernate</strong> é uma das <em>implementações</em> mais populares do JPA (existem outras, como EclipseLink).</li>
                <li>🚀 O <strong>Spring Data</strong> usa essa especificação para criar repositórios automáticos e simplificar consultas.</li>
            </ul>

            <h4 className="mt-3">Principais conceitos</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li><strong>Entity:</strong> é uma classe Java mapeada para uma tabela no banco de dados.</li>
                <li><strong>Repository:</strong> interface que fornece métodos prontos (ex.: <code>save</code>, <code>findAll</code>, <code>delete</code>).</li>
                <li><strong>JpaRepository:</strong> interface base do Spring Data que herda métodos do <code>CrudRepository</code> e <code>PagingAndSortingRepository</code>.</li>
            </ul>

            <h4 className="mt-3">Exemplo básico</h4>
            <pre
                style={{
                    background: "#2d2d3d",
                    padding: "10px",
                    borderRadius: "8px",
                    overflowX: "auto",
                    color: "#a3e635",
                    display: "table"
                }}
            >
                {`@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
}

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByName(String name);
}`}
            </pre>

            <p className="mt-2">
                Com esse código, o Spring Data já cria todos os métodos para CRUD automaticamente.
                Além disso, ele reconhece padrões nos nomes dos métodos — por exemplo, <code>findByName</code>
                gera automaticamente uma query baseada no campo <code>name</code>.
            </p>

            <h4 className="mt-3">Abstração em camadas</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>🔹 O <strong>Spring Data</strong> abstrai o acesso a dados — você escreve apenas interfaces.</li>
                <li>🔹 O <strong>JPA</strong> define as regras de persistência (como anotações <code>@Entity</code>, <code>@Id</code> etc.).</li>
                <li>🔹 O <strong>Hibernate</strong> executa as queries SQL de verdade no banco.</li>
            </ul>

            <h4 className="mt-3">Prós</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>✅ Diminui código repetitivo (CRUD automático).</li>
                <li>✅ Integração nativa com transações e o ecossistema Spring Boot.</li>
                <li>✅ Suporte a queries dinâmicas e personalizadas via <code>@Query</code>.</li>
            </ul>

            <h4 className="mt-3">Contras / pontos de atenção</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>⚠️ Alto nível de abstração pode esconder o funcionamento real do banco.</li>
                <li>⚠️ Nem todas as consultas complexas são simples de expressar via método — às vezes é melhor usar <code>EntityManager</code> ou <code>QueryDSL</code>.</li>
                <li>⚠️ Performance pode sofrer se você depender de carregamento preguiçoso (<code>Lazy Loading</code>) sem cuidado.</li>
            </ul>

            <h4 className="mt-3">Boas práticas</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>🧠 Entenda a diferença entre JPA e Hibernate — saber quem faz o quê evita confusões.</li>
                <li>🧩 Use <code>fetch</code> e <code>join</code> com cuidado para evitar problemas de N+1 queries.</li>
                <li>💡 Prefira DTOs para evitar expor entidades diretamente em respostas da API.</li>
                <li>📊 Monitore consultas lentas — o Hibernate pode gerar SQLs grandes e ineficientes.</li>
            </ul>

            <h4 className="mt-3">Resumo rápido</h4>
            <p className="mt-2">
                O Spring Data é uma poderosa abstração sobre o JPA, permitindo foco na lógica de negócio e não em SQL.
                Ele se apoia em implementações como o Hibernate, que faz o trabalho real de persistência.
                Ideal para quem quer produtividade e integração total com o ecossistema Spring Boot.
            </p>
        </div>
    );
}
