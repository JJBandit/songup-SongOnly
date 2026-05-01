from flask import Flask, jsonify, request
from flask_cors import CORS
from ytmusicapi import YTMusic

app = Flask(__name__)
CORS(app)

@app.route("/flask/search", methods=["GET"])
def search():
    query = request.args.get("query")
    if not query:
        return jsonify({"error": "Query is required"}), 400
    yt = YTMusic()
    results = yt.search(query, filter="videos")

    # Sort results so that official videos appear first, UGC videos last
    results = sorted(results, key=lambda x: "UGC" in x.get("videoType", ""))

    # Limit to 10 results
    results = results[:10]
    return jsonify(results)

@app.route("/flask/get-mood-categories", methods=["GET"])
def get_mood_categories():
    yt = YTMusic()
    mood_categories = yt.get_mood_categories()

    # Only show the "Moods & moments" category
    mood_categories = mood_categories["Moods & moments"]

    response = jsonify(mood_categories)
    response.cache_control.max_age = 60 * 60 * 24  # 24 hours
    return response

@app.route("/flask/get-mood-playlists", methods=["GET"])
def get_mood_playlists():
    mood_category = request.args.get("mood_category")
    if not mood_category:
        return jsonify({"error": "Mood category is required"}), 400
    yt = YTMusic()
    playlists = yt.get_mood_playlists(mood_category)

    # Limit to 15 results
    playlists = playlists[:15]
    response = jsonify(playlists)
    response.cache_control.max_age = 60 * 60 * 24  # 24 hours
    return response

@app.route("/flask/get-playlist", methods=["GET"])
def get_playlist():
    playlistId = request.args.get("playlistId")
    if not playlistId:
        return jsonify({"error": "Playlist ID is required"}), 400
    yt = YTMusic()
    playlist = yt.get_playlist(playlistId)

    if playlist is None:
        return jsonify({"error": "Playlist not found"}), 404
    return jsonify(playlist)