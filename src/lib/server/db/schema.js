import { sqliteTable, text, integer, sql, unique } from 'drizzle-orm/sqlite-core';

const timestamps = {
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
};

export const lineups = sqliteTable('lineups', {
	id: integer('id').primaryKey(),
	urlSlug: text('url_slug').notNull(),
	...timestamps,
});

export const artists = sqliteTable('artists', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	genres: text('genres', { mode: 'json' }).notNull().default(sql`[]`),
	...timestamps,
});

export const lineupsArtists = sqliteTable('lineups_artists', {
	id: integer('id').primaryKey(),
	lineupId: integer('lineup_id').references(() => lineups.id),
	artistId: integer('artist_id').references(() => artists.id),
	...timestamps,
}, (t) => [
	unique().on(t.lineupId, t.artistId),
]);

export const songs = sqliteTable('songs', {
	id: integer('id').primaryKey(),
	url: text('url').notNull(),
	artistId: integer('artist_id').references(() => artists.id),
	...timestamps,
});