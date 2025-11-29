from googleapiclient.discovery import build

API_KEY = "AIzaSyCGlFIHPBSmKOxJGbrMlJnu1Teq835p4Rg"

youtube = build("youtube", "v3", developerKey=API_KEY)

def search_tips_and_tricks():
    request = youtube.search().list(
        q="show shark tank",
        part="snippet",
        type="video",
        maxResults=20,
        videoDuration="short"  # short means < 4 mins (YouTube API doesn't have exact Shorts filter)
    )
    response = request.execute()

    videos = []
    for item in response["items"]:
        video = {
            "title": item["snippet"]["title"],
            "channel": item["snippet"]["channelTitle"],
            "video_id": item["id"]["videoId"],
            "thumbnail": item["snippet"]["thumbnails"]["high"]["url"]
        }
        videos.append(video)

    return videos


# Run and print results
results = search_tips_and_tricks()
for v in results:
    print(v["title"], "→ https://youtube.com/watch?v=" + v["video_id"])