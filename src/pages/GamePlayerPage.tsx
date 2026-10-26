import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import { getGameBySlug } from "@/games/gamesData";

const SITE_URL = "https://freeimageprompt.com";

const GamePlayerPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const game = slug ? getGameBySlug(slug) : undefined;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!game) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center px-4">
                <Gamepad2 className="h-14 w-14 text-muted-foreground" />
                <h1 className="text-2xl font-bold">Game not found</h1>
                <p className="text-muted-foreground mb-2">This game doesn't exist or has been moved.</p>
                <Link
                    to="/games"
                    className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm"
                >
                    Browse All Games
                </Link>
            </div>
        );
    }

    const schema = {
        "@context": "https://schema.org",
        "@type": "VideoGame",
        name: game.title,
        url: `${SITE_URL}/games/${game.slug}`,
        description: game.description,
        genre: "Arcade",
        playMode: "SinglePlayer",
        applicationCategory: "Game",
        operatingSystem: "Web Browser",
    };

    return (
        <div className="min-h-screen bg-background">
            <SEOHead
                title={`${game.title} — Play Free Online | TrendsPrompt`}
                description={game.description}
                canonicalUrl={`${SITE_URL}/games/${game.slug}`}
                keywords={`play ${game.title}, ${game.title} online, free ${game.title} game`}
                schema={schema}
            />
            <Navigation />

            {/* Back link bar */}
            <div className="pt-20 pb-3">
                <div className="container mx-auto px-4 max-w-6xl flex items-center justify-between">
                    <Link
                        to="/games"
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        All Games
                    </Link>
                    <span className="text-sm font-semibold">{game.title}</span>
                </div>
            </div>

            {/* Game iframe fills the area below the nav */}
            <div className="relative w-full" style={{ height: "calc(100vh - 6.5rem)" }}>
                {!loaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted/50">
                        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                        <p className="text-sm text-muted-foreground">Loading {game.title}…</p>
                    </div>
                )}
                <iframe
                    src={game.path}
                    title={game.title}
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen; gamepad"
                    onLoad={() => setLoaded(true)}
                />
            </div>
        </div>
    );
};

export default GamePlayerPage;
