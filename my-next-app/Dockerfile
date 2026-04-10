FROM node:20-alpine AS base

# ── 依存関係インストール ──────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ── ビルド ───────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* はビルド時に埋め込まれるため ARG で受け取る
ARG NEXT_PUBLIC_RAILS_API_URL
ENV NEXT_PUBLIC_RAILS_API_URL=$NEXT_PUBLIC_RAILS_API_URL

RUN npm run build

# ── 本番イメージ ─────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# standalone 出力をコピー
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
