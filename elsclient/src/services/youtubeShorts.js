const API_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const BASE_VIDEO_PARAMS = {
    part: 'snippet',
    type: 'video',
    videoDuration: 'short',
};

const ensureApiKey = () => {
    if (!API_KEY) {
        throw new Error('Missing VITE_YOUTUBE_API_KEY env variable');
    }
};

const buildUrl = (params) => {
    const searchParams = new URLSearchParams({ key: API_KEY });
    Object.entries(params).forEach(([key, value]) => {
        if (typeof value === 'undefined' || value === null) return;
        searchParams.set(key, value);
    });
    return `${API_BASE_URL}?${searchParams.toString()}`;
};

const normalizeVideos = (items) =>
    items
        .filter((item) => item.id?.videoId)
        .map((item) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
            thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
            url: `https://youtube.com/watch?v=${item.id.videoId}`,
        }));

export const fetchYouTubeShorts = async (query, maxResults = 10) => {
    ensureApiKey();

    const response = await fetch(buildUrl({
        ...BASE_VIDEO_PARAMS,
        q: query,
        maxResults,
    }));

    if (!response.ok) {
        throw new Error('Failed to fetch YouTube shorts');
    }

    const data = await response.json();
    return normalizeVideos(data.items || []);
};

const resolveChannelId = async (channelIdentifier) => {
    if (channelIdentifier.startsWith('UC')) {
        return channelIdentifier;
    }

    const cleanedQuery = channelIdentifier
        .replace('@', '')
        .replace(/[_-]/g, ' ')
        .trim();

    const channelResponse = await fetch(buildUrl({
        part: 'snippet',
        type: 'channel',
        maxResults: 1,
        q: cleanedQuery,
    }));

    if (!channelResponse.ok) {
        throw new Error('Failed to resolve channel');
    }

    const channelData = await channelResponse.json();
    const firstChannel = channelData.items?.[0];
    const channelId = firstChannel?.snippet?.channelId || firstChannel?.id?.channelId;

    if (!channelId) {
        throw new Error('Channel not found');
    }

    return channelId;
};

export const fetchYouTubeShortsByChannel = async (channelIdentifier, maxResults = 20) => {
    ensureApiKey();
    const channelId = await resolveChannelId(channelIdentifier);

    const response = await fetch(buildUrl({
        ...BASE_VIDEO_PARAMS,
        channelId,
        order: 'date',
        maxResults,
    }));

    if (!response.ok) {
        throw new Error('Failed to fetch channel shorts');
    }

    const data = await response.json();
    return normalizeVideos(data.items || []);
};

