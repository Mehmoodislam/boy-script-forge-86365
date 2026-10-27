import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Gamepad2, Play, Search, LayoutGrid, X } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getAllGames, getCategoriesWithGames } from "@/games/gamesData";

const SITE_URL = "https://freeimageprompt.com";

const GamesPage = () => {
    const categories = getCategoriesWithGames();
    const allGames = getAllGames();

    const [query, setQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState<string>("all");

    const filteredGames = useMemo(() => {
        const q = query.trim().toLowerCase();
        return allGames.filter((g) => {
            const matchesCategory =
                activeCategory === "all" ||
                categories.some((c) => c.id === activeCategory && c.games.some((cg) => cg.slug === g.slug));
            const matchesQuery =
                !q ||
                g.title.toLowerCase().includes(q) ||
                g.description.toLowerCase().includes(q);
            return matchesCategory && matchesQuery;
        });
    }, [allGames, categories, activeCategory, query]);

    const countFor = (id: string) =>
        id === "all"
            ? allGames.length
            : categories.find((c) => c.id === id)?.games.length ?? 0;

    const activeCategoryName =
        activeCategory === "all"
            ? null
            : categories.find((c) => c.id === activeCategory)?.name;

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
            itemListElement: allGames.map((g, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: g.title,
                url: `${SITE_URL}/games/${g.slug}`,
            })),
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            <SEOHead
                title="Free Online Games — Play Fun Browser Games Instantly | TrendsPrompt"
                description="Play free online games in your browser instantly. No download, no signup — arcade, puzzle and casual games for mobile and desktop."
                canonicalUrl={`${SITE_URL}/games`}
                keywords="free online games, browser games, play games online, arcade games, board games, no download games"
                schema={schema}
            />
            <Navigation />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Header */}
                    <div className="text-center mb-10">
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

                    {/* Marketplace layout: sidebar + grid */}
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Sidebar */}
                        <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 space-y-6">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search games..."
                                    aria-label="Search games"
                                    className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                                />
                                {query && (
                                    <button
                                        type="button"
                                        onClick={() => setQuery("")}
                                        aria-label="Clear search"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {/* Categories */}
                            <div className="rounded-2xl border border-border bg-card p-4">
                                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                                    <LayoutGrid className="h-4 w-4" />
                                    Categories
                                </h2>
                                <ul className="space-y-1">
                                    <li>
                                        <button
                                            type="button"
                                            onClick={() => setActiveCategory("all")}
                                            className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                activeCategory === "all"
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-foreground hover:bg-muted"
                                            }`}
                                        >
                                            <span>All Games</span>
                                            <span
                                                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                                    activeCategory === "all"
                                                        ? "bg-primary-foreground/20"
                                                        : "bg-muted text-muted-foreground"
                                                }`}
                                            >
                                                {countFor("all")}
                                            </span>
                                        </button>
                                    </li>
                                    {categories.map((category) => (
                                        <li key={category.id}>
                                            <button
                                                type="button"
                                                onClick={() => setActiveCategory(category.id)}
                                                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                    activeCategory === category.id
                                                        ? "bg-primary text-primary-foreground"
                                                        : "text-foreground hover:bg-muted"
                                                }`}
                                            >
                                                <span className="truncate">{category.name}</span>
                                                <span
                                                    className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                                                        activeCategory === category.id
                                                            ? "bg-primary-foreground/20"
                                                            : "bg-muted text-muted-foreground"
                                                    }`}
                                                >
                                                    {countFor(category.id)}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>

                        {/* Game grid */}
                        <div className="flex-1 w-full">
                            {/* Result info */}
                            <div className="flex items-center justify-between gap-4 mb-5">
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-semibold text-foreground">
                                        {filteredGames.length}
                                    </span>{" "}
                                    game{filteredGames.length !== 1 ? "s" : ""}
                                    {activeCategoryName ? ` in ${activeCategoryName}` : ""}
                                    {query && (
                                        <>
                                            {" "}matching <span className="font-medium text-foreground">"{query}"</span>
                                        </>
                                    )}
                                </p>
                                {(activeCategory !== "all" || query) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveCategory("all");
                                            setQuery("");
                                        }}
                                        className="text-sm font-medium text-primary hover:underline"
                                    >
                                        Reset filters
                                    </button>
                                )}
                            </div>

                            {filteredGames.length === 0 ? (
                                <div className="rounded-2xl border border-border bg-card p-12 text-center">
                                    <Gamepad2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                                    <h2 className="text-lg font-semibold mb-1">No games found</h2>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Try a different search term or category.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveCategory("all");
                                            setQuery("");
                                        }}
                                        className="text-sm font-medium text-primary hover:underline"
                                    >
                                        Show all games
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {filteredGames.map((game) => {
                                        const categoryName = categories.find((c) =>
                                            c.games.some((cg) => cg.slug === game.slug)
                                        )?.name;
                                        return (
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
                                                    {categoryName && (
                                                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-medium text-foreground">
                                                            {categoryName}
                                                        </span>
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
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default GamesPage;
