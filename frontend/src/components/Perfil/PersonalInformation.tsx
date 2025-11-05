import { TypeAnimation } from "react-type-animation";

export default function PersonalInformation() {
	const text = `
💾 Acessando o banco de dados: Punk Records...

Identificação: Wagraton Wallas — Engenheiro Backend e Arquiteto de Sistemas Distribuídos.

Especialista na construção e sustentação de aplicações escaláveis, resilientes e observáveis em ambientes cloud.
Atuação guiada por princípios de DDD, SOLID e Clean Architecture — onde cada domínio é uma entidade viva, cada camada cumpre seu papel e cada dependência é tratada com respeito e propósito.

Domínio de linguagens como Python e Java, com forte experiência em AWS, microsserviços e automação de infraestrutura utilizando Terraform.
Também realizo manutenção e aprimoramentos em aplicações escritas em JavaScript, TypeScript, Node.js e React, garantindo integração fluida entre front e backend quando necessário.

Minhas memórias são armazenadas no Punk Records — um espaço onde ideias e experiências ficam registradas entre métricas, traces e dashboards.
É lá, entre os grupos de logs do CloudWatch e os gráficos do Datadog, que encontro padrões, inspiro novas soluções e lapido minha visão sobre engenharia de software moderna.

Status atual: em constante evolução, aprimorando processos e pronto para a próxima missão tecnológica.
`;

	return (
		<div
			style={{
				color: 'rgba(255,255,255,0.85)', // menos branco
				fontSize: '110%',
				fontFamily: 'pixel, Roboto, sans-serif',
				textAlign: 'justify',
				display: 'flex',
				overflowY: 'auto',
				flexDirection: 'column',
				height: 'calc(100% - 12.5rem)',
				paddingRight: '0.5rem',
				opacity: 0.7
			}}
		>
			<div style={{ display: "inline-block", width: "100%" }}>
				<TypeAnimation
					sequence={[text, 1000]} // pausa ao fim
					speed={80} // ✅ rápido e natural
					cursor={true}
					style={{
						display: "inline-block",
						whiteSpace: "pre-line",
						width: "100%",
						wordWrap: "break-word",
						height: "100%"
					}}
				/>
			</div>
		</div>
	);
}
