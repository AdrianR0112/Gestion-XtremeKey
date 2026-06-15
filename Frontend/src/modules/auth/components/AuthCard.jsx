import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";

export default function AuthCard({ title, description, children }) {
	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle className="text-2xl">{title}</CardTitle>
				{description ? <CardDescription>{description}</CardDescription> : null}
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
}
