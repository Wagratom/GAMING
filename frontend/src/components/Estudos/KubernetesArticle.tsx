import { IoIosReturnLeft } from "react-icons/io";

export default function KubernetesArticle({ closeEstudo }: { closeEstudo: (e: any, name: string) => void }) {
    return (
        <div
            className="kubernetes-article p-4"
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
                <h1 className="text-center w-100" style={{ color: "#a3e635" }}>O que é Kubernetes?</h1>
            </div>

            <p className="mt-3">
                <strong>Kubernetes</strong> (ou K8s) é uma plataforma open-source para gerenciar containers em larga escala. 
                Ele automatiza o deploy, a escalabilidade e a operação de aplicações em contêineres.
            </p>

            <p className="mt-3">
                Enquanto o <strong>Docker Compose</strong> é excelente para desenvolvimento local e clusters pequenos, o Kubernetes é pensado para produção, onde há múltiplos servidores e alta demanda.
            </p>

            <h4 className="mt-4">💡 Conceitos principais</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>📦 <strong>Pod:</strong> a menor unidade do Kubernetes, que agrupa um ou mais containers que compartilham rede e armazenamento.</li>
                <li>⚙️ <strong>Deployment:</strong> define quantas réplicas de um Pod devem existir e garante que estejam sempre rodando.</li>
                <li>🌐 <strong>Service:</strong> abstração que permite expor Pods para comunicação interna ou externa, com balanceamento de carga automático.</li>
                <li>📌 <strong>Namespace:</strong> divisão lógica para organizar recursos dentro de um cluster.</li>
                <li>📈 <strong>Ingress:</strong> gerencia acesso externo aos serviços, definindo regras de roteamento.</li>
            </ul>

            <h4 className="mt-4">🚀 Por que usar Kubernetes?</h4>
            <ul className="mt-2" style={{ paddingLeft: "20px" }}>
                <li>🔄 <strong>Escalabilidade automática:</strong> aumenta ou diminui o número de containers conforme a demanda.</li>
                <li>🛠 <strong>Resiliência:</strong> se algum container cair, o Kubernetes recria automaticamente.</li>
                <li>🗂 <strong>Desacoplamento:</strong> separa serviços e facilita o deploy contínuo.</li>
                <li>📊 <strong>Monitoramento e gestão:</strong> fornece métricas e logs dos containers e clusters.</li>
            </ul>

            <h4 className="mt-4">📦 Exemplo didático</h4>
            <p className="mt-2">
                Imagine que você tem um site de e-commerce. No Docker Compose você roda 2 containers: frontend e backend.  
                Com Kubernetes, você pode rodar múltiplas réplicas do backend para suportar milhares de usuários, balancear automaticamente a carga e reiniciar qualquer container que falhar — tudo de forma automática.
            </p>

            <h4 className="mt-4">🌐 Relação com Docker e Docker Compose</h4>
            <p className="mt-2">
                Kubernetes usa contêineres (Docker, por exemplo) como base. Ele pega o que você faria com Docker Compose em desenvolvimento local e aplica em produção, 
                distribuindo os containers em múltiplos servidores, garantindo escalabilidade, alta disponibilidade e resiliência.
            </p>
        </div>
    );
}
