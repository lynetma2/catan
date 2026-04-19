#!/usr/bin/env bash
# ============================================================
# catan/docker.sh — Docker Compose helper
#
# Always run from anywhere; the script resolves its own location
# and uses the repo root as the project directory.
#
# Usage:
#   ./docker.sh dev   [up|down|build|logs|ps]
#   ./docker.sh prod  [up|down|build|logs|ps]
#
# Examples:
#   ./docker.sh dev             # starts dev stack (default: up --build)
#   ./docker.sh dev down        # tears down dev stack
#   ./docker.sh dev logs        # follows all logs
#   ./docker.sh dev logs app    # follows logs for a single service
#   ./docker.sh prod up         # starts prod stack detached
#   ./docker.sh prod build      # rebuilds images without starting
# ============================================================

set -euo pipefail

# ── Paths ────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$SCRIPT_DIR"                                        # repo root (catan/)
export REPO_ROOT="$ROOT"   # passed into compose for build contexts
COMPOSE_DIR="$ROOT/environment/docker-setup/compose"
BASE="$COMPOSE_DIR/docker-compose.yml"
DEV="$COMPOSE_DIR/docker-compose.dev.yml"
PROD="$COMPOSE_DIR/docker-compose.prod.yml"
ENV_FILE="$COMPOSE_DIR/.env"

# ── Colours ──────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

# ── Helpers ──────────────────────────────────────────────────
usage() {
  echo -e "${YELLOW}Usage:${NC} $0 <env> [command] [service]"
  echo ""
  echo -e "  ${GREEN}env${NC}      dev | prod"
  echo -e "  ${GREEN}command${NC}  up (default) | down | build | logs | ps"
  echo -e "  ${GREEN}service${NC}  optional — target a single service (e.g. app, db, nginx)"
  echo ""
  echo "Examples:"
  echo "  $0 dev                 # up --build (dev)"
  echo "  $0 dev down"
  echo "  $0 dev logs app"
  echo "  $0 prod up"
  echo "  $0 prod build"
  exit 1
}

check_env_file() {
  if [[ ! -f "$ENV_FILE" ]]; then
    echo -e "${YELLOW}Warning:${NC} .env not found at $ENV_FILE"
    if [[ -f "$COMPOSE_DIR/env.example" ]]; then
      echo -e "  Copying env.example → .env — fill in real values before running prod."
      cp "$COMPOSE_DIR/env.example" "$ENV_FILE"
    else
      echo -e "${RED}Error:${NC} env.example also missing. Cannot continue."
      exit 1
    fi
  fi
}

# ── Args ─────────────────────────────────────────────────────
[[ $# -lt 1 ]] && usage

ENV="${1:-}"; shift || true
CMD="${1:-up}"; shift || true
SERVICE="${1:-}"          # optional — passed through to compose

case "$ENV" in
  dev)  OVERRIDE="$DEV"  ;;
  prod) OVERRIDE="$PROD" ;;
  *)    echo -e "${RED}Error:${NC} unknown env '$ENV'"; usage ;;
esac

check_env_file

# Base compose command — always anchored to repo root so build contexts resolve
DC="docker compose \
  --profile $([[ "$ENV" == "prod" ]] && echo prod || echo dev) \
  --project-directory \"$ROOT\" \
  -f \"$BASE\" \
  -f \"$OVERRIDE\" \
  --env-file \"$ENV_FILE\""

# ── Commands ─────────────────────────────────────────────────
case "$CMD" in
  up)
    echo -e "${GREEN}Starting${NC} [$ENV] stack…"
    if [[ "$ENV" == "prod" ]]; then
      eval "$DC up -d $SERVICE"
    else
      eval "$DC up --build $SERVICE"
    fi
    ;;

  down)
    echo -e "${YELLOW}Stopping${NC} [$ENV] stack…"
    eval "$DC down $SERVICE"
    ;;

  build)
    echo -e "${GREEN}Building${NC} [$ENV] images…"
    eval "$DC build $SERVICE"
    ;;

  logs)
    eval "$DC logs -f $SERVICE"
    ;;

  ps)
    eval "$DC ps $SERVICE"
    ;;

  *)
    echo -e "${RED}Error:${NC} unknown command '$CMD'"
    usage
    ;;
esac