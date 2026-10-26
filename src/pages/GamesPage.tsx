import { Link } from "react-router-dom";
import { Gamepad2, Play } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getCategoriesWithGames } from "@/games/gamesData";

const SITE_URL = "https://freeimageprompt.com";

const GamesPage = () => {
    const categories = getCategoriesWithGames();

    const schema = [
        {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Free Online Games",
            url: `${SITE_URL}/games`,
            description: "Play free online browser games instantly — no download, no signup required.",
        },
        {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Free Online Games",
            itemListElement: categories.flatMap((c, ci) =>
                c.games.map((g, gi) => ({
                    "@type": "ListItem",
                    position: ci * c.games.length + gi + 1,
                    name: g.title,
                    url: `${SITE_URL}/games/${g.slug}`,
                }))
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            <SEOHead
                title="Free Online Games — Play Fun Browser Games Instantly | TrendsPrompt"
                description="Play free online games in your browser instantly. No download, no signup — arcade, puzzle and casual games for mobile and desktop."
                canonicalUrl={`${SITE_URL}/games`}
                keywords="free online games, browser games, play games online, arcade games, no download games"
                schema={schema}
            />
            <Navigation />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                            <Gamepad2 className="h-4 w-4" />
                            100% Free · No Download · No Signup
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                            Free Online Games
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Play fun browser games instantly — works on mobile and desktop. Pick a game
                            and start playing right away.
                        </p>
                    </div>

                    {/* Category sections */}
                    {categories.map((category) => (
                        <section key={category.id} className="mb-14">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold mb-1">{category.name} Games</h2>
                                <p className="text-sm text-muted-foreground">{category.description}</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.games.map((game) => (
                                    <Link
                                        key={game.slug}
                                        to={`/games/${game.slug}`}
                                        className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <div className="relative aspect-video overflow-hidden bg-muted">
                                            {game.thumb ? (
                                                <img
                                                    src={game.thumb}
                                                    alt={`${game.title} game`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    loading="lazy"
                                                    width={1280}
                                                    height={768}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                                    <Gamepad2 className="h-14 w-14 text-primary/60" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/40">
                                                <span className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-lg">
                                                    <Play className="h-4 w-4 fill-current" />
                                                    Play Now
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                                                {game.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                {game.description}
                                            </p>
                                            <span className="text-xs text-muted-foreground/70 font-medium">
                                                Controls: {game.controls}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default GamesPage;
