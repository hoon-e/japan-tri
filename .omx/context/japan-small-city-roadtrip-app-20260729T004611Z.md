# Deep Interview Context Snapshot

- **Task slug:** `japan-small-city-roadtrip-app`
- **Captured at:** 2026-07-29T00:46:11Z
- **Context type:** Greenfield
- **Prompt-safe initial-context summary:** `not_needed`

## Task statement

Create a web application that:

1. Narrows down Japanese small-city destinations that have strong flight access from Korea.
2. Favors destinations suitable for rental-car trips through nearby small towns.
3. Randomly selects one candidate.
4. Provides information about the selected destination and recommends a travel route.

## Desired outcome

A traveler departing from Korea can avoid destination-choice fatigue and receive a practical, appealing self-drive small-city itinerary in Japan.

## Stated solution

A destination discovery and itinerary recommendation web application with a randomized selection step.

## Probable intent hypothesis

The user wants to combine the fun of spontaneous discovery with enough transportation practicality that the resulting recommendation is genuinely bookable and drivable.

## Known facts / evidence

- The repository contains no application source, README, product documents, or Git metadata.
- Only OMX runtime/state artifacts exist.
- The request is therefore treated as a greenfield product.
- No relevant prior Mnemonic history was found.

## Constraints stated by the user

- Destination must be in Japan.
- There should be many flights departing from Korea.
- The destination should work well as a rental-car base for visiting small towns.
- Selection among qualified destinations should be random.
- The app should provide destination information and a recommended travel route.

## Unknowns / open questions

- Primary user and core motivation.
- Definition and evidence threshold for “many flights.”
- Whether the flight airport itself, a nearby city, or a broader region is the randomized unit.
- Trip length, season, budget, departure airport, and party type.
- Whether recommendations are static/curated or use live flight, map, weather, and place data.
- What route detail and personalization the MVP must support.
- Candidate eligibility rules and randomness behavior.
- Monetization, language, sharing, booking links, and account requirements.
- Testable success criteria.

## Decision-boundary unknowns

- Which product, UX, technical, and data-source decisions OMX may make autonomously.
- Which external integrations or ongoing costs require explicit approval.
- Which features must remain out of scope for the first version.

## Likely codebase touchpoints

- New frontend application
- Destination and route data model
- Random selection / filtering logic
- Optional external APIs for flights, maps, routing, weather, and places
- Tests and deployment configuration

## Repo docs / rules / context inspected

- Workspace root file scan (no project documentation found)
- `.omx/` runtime/state artifacts
- User-provided `AGENTS.md` instructions
- Installed `$deep-interview` skill

## Terminology or doc/code conflicts

None; no application docs or code exist. The terms “소도시,” “비행기가 많이,” and the randomized selection unit remain product decisions requiring clarification.
