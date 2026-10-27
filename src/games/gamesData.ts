// Central registry for all games. To add a new game later:
// 1. Drop the game's HTML in `public/games/<slug>/index.html`
// 2. Add an entry to the category's `games` array below.

export interface GameEntry {
    slug: string;
    title: string;
    description: string;
    /** Path to the game's standalone HTML file (served from /public) */
    path: string;
    /** Optional imported thumbnail image */
    thumb?: string;
    controls: string;
}

export interface GameCategory {
    id: string;
    name: string;
    description: string;
    games: GameEntry[];
}

import puffFlapThumb from "@/assets/games/puff-flap-thumb.png";
import ticTacToeThumb from "@/assets/games/tic-tac-toe-thumb.png";

export const gameCategories: GameCategory[] = [
    {
        id: "arcade",
        name: "Arcade",
        description: "Fast, fun classics you can play in one tap",
        games: [
            {
                slug: "puff-flap",
                title: "Puff Flap",
                description: "Guide the little bird through endless pipes. Tap, click or press Space to flap — collect stars for bonus points and chase your best score.",
                path: "/games/puff-flap/index.html",
                thumb: puffFlapThumb,
                controls: "Tap / Click / Space",
            },
        ],
    },
    {
        id: "board",
        name: "Board & Strategy",
        description: "Classic games of skill — outsmart your opponent",
        games: [
            {
                slug: "tic-tac-toe",
                title: "Timber Tic Tac Toe",
                description: "Wooden tic-tac-toe with a twist — play against a friend on one device or challenge the CPU across three difficulty levels. Get three in a row to win.",
                path: "/games/tic-tac-toe/index.html",
                thumb: ticTacToeThumb,
                controls: "Tap / Click",
            },
        ],
    },
];

export const getAllGames = (): GameEntry[] => gameCategories.flatMap((c) => c.games);

export const getGameBySlug = (slug: string): GameEntry | undefined =>
    getAllGames().find((g) => g.slug === slug);

export const getCategoriesWithGames = (): GameCategory[] =>
    gameCategories.filter((c) => c.games.length > 0);
