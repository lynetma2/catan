# Roadmap
## Current Focus
*   Implement core game loop for basic turn structure (dice roll, resource collection, trading, building).
*   Develop UI for placing settlements, cities, and roads.
*   Basic multiplayer functionality (hotseat mode is currently implemented, expand to networked).

## Next Steps
*   Implement trading mechanics (player-to-player and bank).
*   Add development cards and their effects.
*   Refine game state management and validation logic.
*   Improve visual feedback for player actions and game events.

# Feature requests approved.
*   **Water outside the board should use textures and 3d effect from "Sea of Thieves"**: This is a visual enhancement request for the sea tiles.
*   **Ping system**: Implement a way for players to communicate non-verbally, similar to "bait" pings in other games.

# Feature requests not approved.
*   (No unapproved feature requests at this time.)


# Prioritized List of the architecture with missing pieces:
1.  **Event Queue/Command Pattern**: Implement a robust event queuing system for game actions to ensure order, replayability, and easier debugging.
2.  **Game State Validation**: Centralize and enhance the validation logic for player moves and game state transitions.
3.  **UI Framework/Component Library**: Standardize UI components for consistency and faster development.
4.  **Error Handling and Logging**: Improve error reporting and logging mechanisms for both client and server.
5.  **Animation System**: Implement a system for smooth animations of game elements.
6.  **Asset Management**: A more structured way to load and manage game assets (images, sounds, models).
7.  **Sound/Music Integration**: Add audio feedback for game events and background music.
8.  **Physics Engine**: Integrate or develop a simple physics system if dynamic elements (e.g., dice rolling animation) are desired.
9.  **Profiler**: Implement a profiling tool to monitor game performance (FPS, logic update times, render times).
10. **Game Balancing/Configuration**: Externalize game parameters for easier tuning.
11. **Tutorial/Onboarding System**: Guide new players through the game mechanics.
12. **AI/Bot Players**: Develop AI for computer-controlled opponents.
13. **Persistent Storage**: Save/load game states, player profiles, and settings.
14. **Multiplayer Implementation**: Transition from hotseat to a networked multiplayer system. This involves:
    *   Server-side game state management.
    *   Client-server communication (e.g., WebSockets).
    *   Synchronization of game actions and state across clients.
    *   Authentication and player session management.
15. **Spectator Mode**: Allow users to watch ongoing games.
16. **Replay System**: Record and replay game sessions.
17. **Chat System**: In-game communication between players.
18. **Ping System**: As requested, a non-verbal communication system.
