import { useState, useEffect } from "react";

type TypewriterProps = {
	text: string;
	speed?: number; // milissegundos entre cada letra
};

function Typewriter({ text, speed = 30 }: TypewriterProps) {
	const [displayedText, setDisplayedText] = useState("");

	useEffect(() => {
		let index = 0;
		const interval = setInterval(() => {
			setDisplayedText((prev) => prev + text.charAt(index));
			index++;
			if (index >= text.length) clearInterval(interval);
		}, speed);

		return () => clearInterval(interval);
	}, [text, speed]);

	// Substitui \n por <br /> para respeitar quebras de linha
	const formattedText = displayedText.split("\n").map((line, i) => (
		<span key={i}>
			{line}
			<br />
		</span>
	));

	return (
		<p style={{ fontFamily: "pixel, monospace", fontSize: "1.1rem", color: "rgba(255,255,255,0.85)", textAlign: "justify" }}>
			{formattedText}
			<span className="cursor">|</span>
			<style>
				{`
					.cursor {
						display: inline-block;
						animation: blink 0.7s infinite;
					}
					@keyframes blink {
						0%, 50%, 100% { opacity: 1; }
						25%, 75% { opacity: 0; }
					}
				`}
			</style>
		</p>
	);
}

export default function PersonalInformation() {
	const cssInfoProfile: React.CSSProperties = {
		color: 'rgba(255,255,255,0.85)', // menos branco
		fontSize: '110%',
		fontFamily: 'pixel, Roboto, sans-serif',
		textAlign: 'justify',
		display: 'flex',
		overflowY: 'auto',
		flexDirection: 'column',
		height: 'calc(100% - 12rem)',
		paddingRight: '0.5rem',
		opacity: 0.7
	};

	const text = `Olá, invocador! 🧙‍♂️
Bem-vindo ao meu mundo! Aqui você pode ver toda a minha história e experiências.

Sou formado pela Escola 42 São Paulo — referência em fundamentos sólidos de programação — e atualmente curso Análise e Desenvolvimento de Sistemas. Tenho experiência prática em linguagens como C/C++, Java, Python, JavaScript e TypeScript, além de frameworks e ferramentas como React, Node.js, Docker, Terraform e LangChain para aplicações de IA generativa.

Atuo no Itaú Unibanco como Desenvolvedor Júnior, com foco em Python, AWS e boas práticas de arquitetura em nuvem. Minha rotina envolve a criação e manutenção de infraestrutura como código com Terraform, além do desenvolvimento de serviços serverless altamente disponíveis. Faço parte da área de sustentação da squad, sendo responsável por analisar, investigar e levantar insumos a partir de dashboards e alarmes de monitoramento que geram incidentes proativos — permitindo antecipar falhas antes que impactem o cliente.

Também atuo diretamente na investigação e mitigação de incidentes de negócio, normalmente os mais críticos. Por conta disso, possuo ampla experiência com ferramentas como AWS CloudWatch, X-Ray, Datadog e Logs Insights para análise de métricas, rastreamento de logs e correlação de eventos.

Tenho experiência com diversos serviços AWS, incluindo Lambda, Step Functions, SQS, SNS, ECS, EC2 e API Gateway, além da criação de APIs REST seguindo as boas práticas do OpenAPI 2.0. Atualmente, venho estudando Spring Boot, pagamentos via PIX e métodos de autenticação, aprimorando meus conhecimentos em orquestração de serviços e observabilidade em ambientes cloud-native.`;

	return (
		<div style={cssInfoProfile}>
			<h2 >Wagraton Wallas</h2>
			<Typewriter text={text} speed={20} />
		</div>
	);
}
