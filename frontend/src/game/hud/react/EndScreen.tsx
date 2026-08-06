import type {EndGameSummary} from "@/game/core/types";

interface EndScreenProps {
    data: EndGameSummary;
    localPlayerId: string | null;
    onClose: () => void;
}

export function EndScreen({data, localPlayerId, onClose}: EndScreenProps) {
    const winner = data.players.find(p => p.id === data.winnerId);
    const isLocalPlayerWinner = winner?.id === localPlayerId;

    // Sort players by victory points descending
    const sortedPlayers = [...data.players].sort((a, b) => b.victoryPoints - a.victoryPoints);

    return (
        <div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-8 w-full max-w-md text-white">
                <h2 className="text-3xl font-bold text-center mb-2">
                    {isLocalPlayerWinner ? "🎉 Victory!" : "Game Over"}
                </h2>
                <p className="text-center text-gray-400 mb-6">
                    {isLocalPlayerWinner
                        ? "You have conquered the island!"
                        : `${winner?.name ?? 'Unknown'} has won the game.`}
                </p>

                <div className="space-y-3 mb-8">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Final Standings</h3>
                    {sortedPlayers.map((player, index) => (
                        <div
                            key={player.id}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                                player.id === localPlayerId ? 'bg-blue-900/40 border border-blue-500/50' : 'bg-gray-800/50'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-gray-500 w-6">#{index + 1}</span>
                                <div
                                    className="w-4 h-4 rounded-full border-2 border-white/20"
                                    style={{backgroundColor: player.color}}
                                />
                                <span className="font-medium">{player.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex gap-2 text-xs">
                                    {player.hasLongestRoad &&
                                        <span className="px-2 py-0.5 bg-orange-900/50 text-orange-300 rounded">Longest Road</span>}
                                    {player.hasLargestArmy && <span
                                        className="px-2 py-0.5 bg-red-900/50 text-red-300 rounded">Largest Army</span>}
                                </div>
                                <span className="text-xl font-bold text-yellow-400">{player.victoryPoints} VP</span>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 transition-colors rounded-lg font-semibold text-lg"
                >
                    Return to Lobby
                </button>
            </div>
        </div>
    );
}