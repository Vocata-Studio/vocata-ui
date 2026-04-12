#!/usr/bin/env bash
set -euo pipefail

SKILL_NAME="vocata-ui"
REPO_URL="https://github.com/Vocata-Studio/vocata-ui.git"
INSTALL_DIR="${HOME}/.claude/skills/${SKILL_NAME}"

echo "Installing ${SKILL_NAME}..."

# Check if Claude Code skills directory exists
if [ ! -d "${HOME}/.claude/skills" ]; then
  echo "Creating ~/.claude/skills/ directory..."
  mkdir -p "${HOME}/.claude/skills"
fi

# Check if already installed
if [ -d "${INSTALL_DIR}" ]; then
  echo "Updating existing installation..."
  git -C "${INSTALL_DIR}" pull --ff-only
  echo "Updated ${SKILL_NAME} successfully."
  exit 0
fi

# Clone into skills directory
echo "Cloning ${SKILL_NAME}..."
git clone "${REPO_URL}" "${INSTALL_DIR}"

echo ""
echo "${SKILL_NAME} installed successfully!"
echo ""
echo "Usage: In any Claude Code session, say:"
echo "  Create a testimonial section under the hero, use /vocata-ui"
echo ""
echo "Start a new Claude Code session to pick up the skill."
