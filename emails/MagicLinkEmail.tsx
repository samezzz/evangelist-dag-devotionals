import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

export default function MagicLinkEmail({
	url,
	host,
}: {
	url: string | null;
	host: string;
}) {
	return (
		<Html>
			<Head />
			<Preview>Login to Daily Counsel</Preview>
			<Tailwind>
				<Body className="mx-auto my-auto bg-white font-sans">
					<Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
						<Section className="mt-8">
							<Img
								src="/quietTime.jpeg"
								width="40"
								height="40"
								alt="Daily Counsel"
								className="mx-auto my-0"
							/>
						</Section>
						<Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">
							Welcom to Daily Counsel
						</Heading>
						<Link href={url as string} target="_blank" style={{
							display: 'block',
							marginBottom: '16px'
						}}>Click here to log in with this magic link</Link>
						<Text className="text-sm leading-6 text-black">
							Thanks for signing up to {host}
						</Text>
						<Text className="text-sm leading-6 text-black">
							My name is Samess, and I'm excited to have you on board!
						</Text>
						<Text className="ml-1 text-sm leading-4 text-black">
							◆ Follow Evangelist Dag on{" "}
							<Link
								href="https://twitter.com/EvangelistDag"
								className="font-medium text-blue-600 no-underline"
							>
								Twitter
							</Link>
						</Text>
						<Text className="text-sm leading-6 text-black">
							Let me know if you have any questions or feedback. I'm always happy to
							help!
						</Text>
						<Text className="text-sm font-light leading-6 text-gray-400">
							Samess from Daily Counsel
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
