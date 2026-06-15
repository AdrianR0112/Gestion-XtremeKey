import { Button } from "./button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

export default function FeaturePlaceholder({ title, description }) {
    return (
        <Card className="max-w-4xl mx-auto border-dashed text-center">
            <CardHeader>
                <CardTitle className="text-2xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Vista adaptada con componentes Shadcn UI.
                </p>
            </CardContent>
            <CardFooter className="justify-center">
                <Button variant="outline">Configurar modulo</Button>
            </CardFooter>
        </Card>
    );
}
