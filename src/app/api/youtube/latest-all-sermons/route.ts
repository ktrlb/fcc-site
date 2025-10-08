import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const PLAYLIST_ID = 'PLIzXPqkTiuZ1_dV_O3IFz4At_Hb9SsMyx'; // All Sermons playlist

    if (!API_KEY) {
      return NextResponse.json(
        { error: 'YouTube API key not configured' },
        { status: 500 }
      );
    }

    // Fetch the latest video from the playlist
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&maxResults=1&key=${API_KEY}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error('Failed to fetch playlist data');
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
    const description = latestVideo.snippet.description;
    const thumbnail = latestVideo.snippet.thumbnails.high.url;

    return NextResponse.json({
      videoId,
      title,
      description,
      thumbnail,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
    });
  } catch (error) {
    console.error('Error fetching YouTube playlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest sermon video' },
      { status: 500 }
    );
  }
}

