import { IoIosReturnLeft } from "react-icons/io";
import { MouseEvent } from 'react';

export default function DDDArticle({closeEstudo}: {closeEstudo: (e: any, name: string) => void}) {
    return (
        <div
            className="ddd-article p-4"
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
                <IoIosReturnLeft size={25} className="text-start c-pointer" onClick={(e) => closeEstudo(e, '')}/>
                <h1 className="text-center w-100" style={{ "color": "#a3e635" }}> Como funciona o DDD (Domain-Driven Design)</h1>
            </div>

            <p className="mt-3">
                Recentemente, comecei a estudar sobre <strong>DDD (Domain-Driven Design)</strong> e percebi que, graças à era da informação, não é mais necessário adquirir livros ou cursos pagos para ter acesso a materiais de estudo.
                No entanto, essa abundância de conteúdos disponíveis também traz um desafio: a diversidade de interpretações sobre o mesmo tema pode gerar confusões e dificultar a compreensão do conceito original.
            </p>

            <p className="mt-3">
                Muitas pessoas, ao falar sobre <strong>DDD</strong>, acabam associando-o diretamente a um <strong>padrão de arquitetura</strong>, mencionando termos como <strong>Domain</strong>, <strong>Services</strong> e <strong>Infrastructure</strong>.
                Contudo, <strong>DDD não se refere especificamente a uma arquitetura de software</strong>, e sim a um <strong>conjunto de princípios, práticas e padrões</strong> voltados à compreensão e modelagem do <strong>domínio do negócio</strong>,
                de modo que o software reflita com precisão as <strong>regras e comportamentos do mundo real</strong>.
            </p>


            <h4 className="mt-4">1. O que é DDD, afinal?</h4>
            <p>Muitas pessoas associam o DDD a um <strong>padrão de arquitetura</strong>, mencionando pastas como <em>Domain</em>, <em>Services</em> e <em>Infrastructure</em>. No entanto, essa é uma visão incompleta. O <strong>Domain-Driven Design</strong> não é uma arquitetura de software, mas sim um <strong>conjunto de princípios, práticas e padrões de modelagem</strong>, cujo objetivo é <strong>compreender profundamente o domínio do negócio</strong> e <strong>traduzir essa compreensão em código</strong>.</p>
            <p className="mt-3">Em outras palavras, o DDD busca garantir que o software <strong>represente fielmente as regras, os processos e os comportamentos do mundo real</strong>, colocando o <strong>negócio no centro do desenvolvimento</strong>.</p>

            <h4 className="mt-4">2. O Domínio como núcleo da aplicação</h4>
            <p>
                Tudo no DDD gira em torno do <strong>domínio</strong>, que é o
                <strong>núcleo conceitual da aplicação</strong>. Ele responde perguntas essenciais, como:
            </p>
            <ul className="list-disc list-inside ml-4">
                <li>Qual é o propósito desta aplicação?</li>
                <li>Que problema real ela resolve?</li>
                <li>Quais são suas principais regras de negócio?</li>
            </ul>
            <p>
                O domínio é o ponto de partida. É nele que identificamos
                <strong>as entidades</strong>, <strong>os processos principais</strong>,
                <strong>as relações</strong> e <strong>as restrições</strong> que definem o sistema.
                Somente após termos uma visão clara e tangível do domínio, podemos seguir para
                as próximas etapas da modelagem.
            </p>



            <h4 className="mt-4">3. A importância da Linguagem Ubíqua</h4>
            <p>
                Após compreender o domínio, surge uma questão fundamental:
                <strong>como garantir que todos na equipe entendam o negócio da mesma forma?</strong>
            </p>
            <p className="mt-3">
                Em uma equipe de desenvolvimento, convivem profissionais com perfis diferentes —
                desenvolvedores, analistas de negócio, profissionais de atendimento, gerentes de produto,
                entre outros. Cada um tende a interpretar conceitos e termos de forma distinta,
                o que pode gerar ruídos na comunicação e inconsistências na modelagem.
            </p>
            <p className="mt-3">
                É nesse ponto que entra o conceito de
                <strong>Linguagem Ubíqua (Ubiquitous Language)</strong>.
            </p>

            <p className="mt-3">
                Essa prática propõe a criação de um <strong>vocabulário comum</strong> entre todos os
                membros do time, baseado nos termos reais do negócio. Esse vocabulário deve ser utilizado
                <strong>em toda a comunicação</strong> — desde conversas e documentações até nomes de classes,
                métodos e variáveis no código.
            </p>
            <p className="mt-3">
                Por exemplo, se o negócio utiliza o termo <strong>“Pedido”</strong>, o código também deve
                utilizar <strong>“Pedido”</strong>, e não “Order” ou “Requisição”.
                Essa consistência garante clareza, reduz ambiguidades e torna o software uma
                representação fiel do domínio.
            </p>

            <ul>
                <li><strong>Entidades (Entities):</strong> Representam objetos com identidade própria e ciclo de vida. Exemplo: <em>Cliente</em>, <em>Pedido</em>, <em>Produto</em>.</li>
                <li><strong>Objetos de Valor (Value Objects):</strong> Representam conceitos definidos apenas por seus atributos, sem identidade. Exemplo: <em>Endereço</em>, <em>CPF</em>, <em>Dinheiro</em>.</li>
                <li><strong>Serviços de Domínio (Domain Services):</strong> Contêm regras de negócio que não pertencem a uma única entidade.</li>
                <li><strong>Agregados (Aggregates):</strong> Conjuntos de entidades e objetos de valor tratados como uma unidade lógica.</li>
                <li><strong>Repositórios (Repositories):</strong> Responsáveis por armazenar e recuperar agregados.</li>
                <li><strong>Eventos de Domínio (Domain Events):</strong> Representam algo significativo que aconteceu no negócio.</li>
            </ul>
            <p>Esses elementos, em conjunto, formam um <strong>modelo rico do domínio</strong>, que reflete com precisão as regras e comportamentos da aplicação.</p>

            <h4 className="mt-4">5. Contextos Delimitados (Bounded Contexts)</h4>
            <p>Em sistemas complexos, é comum que existam <strong>vários subdomínios</strong> dentro do mesmo negócio. Por exemplo, em um sistema de e-commerce, podemos ter:</p>
            <ul>
                <li>Contexto de <strong>Pagamentos</strong></li>
                <li>Contexto de <strong>Pedidos</strong></li>
                <li>Contexto de <strong>Catálogo de Produtos</strong></li>
            </ul>
            <p>Cada contexto possui suas próprias regras, entidades e terminologias. O DDD propõe o uso de <strong>Bounded Contexts</strong> para <strong>delimitar os limites de cada subdomínio</strong>, evitando que conceitos diferentes se misturem e causem confusão. A comunicação entre contextos ocorre por meio de <strong>interfaces bem definidas</strong>, garantindo que cada parte do sistema evolua de forma independente.</p>

            <h4 className="mt-4">6. Arquitetura e Estrutura de Projeto</h4>
            <p>Embora o DDD não defina uma arquitetura obrigatória, seus princípios se integram de forma natural a arquiteturas que <strong>priorizam isolamento e baixo acoplamento</strong>, como:</p>
            <ul>
                <li><strong>Clean Architecture</strong></li>
                <li><strong>Arquitetura Hexagonal (Ports and Adapters)</strong></li>
                <li><strong>Arquitetura em Camadas (Layered Architecture)</strong></li>
            </ul>
            <p>Em um projeto que aplica DDD, a <strong>camada de domínio (Domain)</strong> é sempre o ponto central. As demais camadas — <em>application</em>, <em>infrastructure</em> e <em>interfaces</em> — são construídas em torno dela.</p>

            <pre
                className="mt-2"
                style={{
                    background: "#27293d",
                    padding: "16px",
                    borderRadius: "8px",
                    color: "#a3e635",
                    whiteSpace: "pre", // <-- mantém as quebras e espaçamentos!
                    fontFamily: "monospace",
                    display: "table"
                }}
            >
                {`/domain
├── entities/
├── value_objects/
├── services/
└── events/

/application
├── use_cases/
└── dto/

/infrastructure
├── repositories/
├── adapters/
└── configuration/

/interfaces
├── controllers/
└── api/`}
            </pre>


            <p>Essa separação permite que o domínio permaneça <strong>puro e independente de detalhes técnicos</strong>, tornando o sistema mais <strong>sustentável, testável e de fácil manutenção</strong>.</p>

            <h4 className="mt-4">7. Conclusão</h4>
            <p>O <strong>Domain-Driven Design</strong> não é uma arquitetura, mas uma <strong>filosofia de design orientada ao domínio</strong>. Seu objetivo principal é aproximar o software do negócio, garantindo que o sistema evolua de forma coerente com as necessidades reais da empresa.</p>
            <p>Ao aplicar DDD, as equipes deixam de construir apenas código e passam a construir <strong>modelos de negócio vivos</strong>, baseados em <strong>linguagem comum, entendimento compartilhado e princípios sólidos de modelagem</strong>. Quando combinado a boas práticas arquiteturais — como Clean Architecture ou Arquitetura Hexagonal — o DDD se torna uma poderosa abordagem para desenvolver sistemas <strong>claros, escaláveis e alinhados ao propósito do negócio</strong>.</p>
        </div>
    )
}