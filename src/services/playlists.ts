// Interfaces
import type { Playlist } from '../interfaces/playlists';
import type { Pagination, PaginationQueryParams } from '../interfaces/api';
import axios from '../axios';

/**
 * @description Get a list of the playlists owned or followed by the current Spotify user.
 */
const getMyPlaylists = async (params: PaginationQueryParams = {}) => {
  return axios.get<Pagination<Playlist>>('/me/playlists', { params });
};

interface GetFeaturedPlaylistsParams extends PaginationQueryParams {
  locale?: string;
}

/**
 * @description Get a list of Spotify featured playlists (shown, for example, on a Spotify player's 'Browse' tab).
 */
const getFeaturedPlaylists = async (params: GetFeaturedPlaylistsParams = {}) => {
  return axios.get<{ playlists: Pagination<Playlist> }>('/browse/featured-playlists', { params });
};

export const playlistService = {
  getMyPlaylists,
  getFeaturedPlaylists,
};