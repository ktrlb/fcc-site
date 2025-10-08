import { NextResponse } from 'next/server';

const PLAYLIST_ID = 'PLIzXPqkTiuZ2-HZULvSEX-nX2WQxWTexf';
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export async function GET() {
  try {
    if (!YOUTUBE_API_KEY) {
      console.error('YouTube API key not configured');
      return NextResponse.json(
        { error: 'YouTube API not configured' },
        { status: 500 }
      );
    }

    // Fetch the latest video from the playlist
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from YouTube API');
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: 'No videos found in playlist' },
        { status: 404 }
      );
    }

    const latestVideo = data.items[0];
    const videoId = latestVideo.snippet.resourceId.videoId;
    const title = latestVideo.snippet.title;
    const thumbnail = latestVideo.snippet.thumbnails?.high?.url || latestVideo.snippet.thumbnails?.default?.url;

    return NextResponse.json({
      videoId,
      title,
      thumbnail,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
    });
  } catch (error) {
    console.error('Error fetching latest modern worship video:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest video' },
      { status: 500 }
    );
  }
}

