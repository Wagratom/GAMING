
export default function PersonalInformation() {
	const cssInfoProfile: React.CSSProperties = {
		color: 'white',
		fontSize: '120%',
		fontFamily: 'pixel, Roboto, sans-serif',
		textAlign: 'justify',
	}

	return (
		<div style={cssInfoProfile}>
			<div id='personal-summary'>
				<h2 style={{ opacity: '0.5' }}>Wagraton Wallas</h2>
				<p style={{ opacity: '0.5' }}>
					Olá! Sou formado pela Escola 42 São Paulo, referência em fundamentos de programação,
					e atualmente curso Análise e Desenvolvimento de Sistemas. Tenho experiência prática em
					linguagens como C/C++, Java, Python, JavaScript e TypeScript, além de frameworks e
					ferramentas como React, Node.js, Docker e Terraform.
				</p>
				<br />
				<p style={{ opacity: '0.5' }}>
					Atuo no Itaú Unibanco como Desenvolvedor Júnior, com foco em Python, AWS e boas práticas
					de arquitetura em nuvem. Minha rotina envolve desenho de arquitetura, rastreamento de
					logs com AWS X-Ray, monitoramento e observabilidade com Datadog, além de atuar no suporte
					direto a clientes, garantindo estabilidade, automação e rápida resolução de incidentes.
				</p>

			</div>
		</div>
	);
}
