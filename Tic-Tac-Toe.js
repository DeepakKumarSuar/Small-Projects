// Initialize touch support
addTouchSupport();

// Game Statistics (Optional Enhancement)
function getGameStats() {
    const totalGames = gameState.scores.x + gameState.scores.o + gameState.scores.ties;
    
    if (totalGames === 0) {
        return {
            totalGames: 0,
            xWinRate: 0,
            oWinRate: 0,
            tieRate: 0
        };
    }
    
    return {
        totalGames: totalGames,
        xWinRate: Math.round((gameState.scores.x / totalGames) * 100),
        oWinRate: Math.round((gameState.scores.o / totalGames) * 100),
        tieRate: Math.round((gameState.scores.ties / totalGames) * 100)
    };
}

// Export functions for potential future use
window.TicTacToe = {
    resetGame,
    resetScores,
    getGameStats,
    selectGameMode,
    showModeSelection
};