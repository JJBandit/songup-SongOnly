import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

const YTMUSIC_BASE = "https://music.youtube.com/youtubei/v1"

async function ytSearch(query: string) {
    const response = await fetch(`${YTMUSIC_BASE}/search?prettyPrint=false`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        },
        body: JSON.stringify({
            context: {
                client: {
                    clientName: "WEB_REMIX",
                    clientVersion: "1.20240404.01.00",
                },
            },
            query,
            params: "EgWKAQIIAWoKEAMQBBAJEAoQBQ%3D%3D",
        }),
    })

    if (!response.ok) {
        throw new Error(`YouTube Music search failed: ${response.status}`)
    }

    return response.json()
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ endpoint: string }> },
) {
    const { endpoint } = await params
    const searchParams = request.nextUrl.searchParams

    try {
        if (endpoint === "search") {
            const query = searchParams.get("query")

            if (!query) {
                return NextResponse.json(
                    { error: "Query is required" },
                    { status: 400 },
                )
            }

            const raw = await ytSearch(query)

            return NextResponse.json(raw)
        }

        if (endpoint === "get-mood-categories") {
            return NextResponse.json(
                { error: "Mood categories not yet converted from Flask" },
                { status: 501 },
            )
        }

        if (endpoint === "get-mood-playlists") {
            return NextResponse.json(
                { error: "Mood playlists not yet converted from Flask" },
                { status: 501 },
            )
        }

        if (endpoint === "get-playlist") {
            return NextResponse.json(
                { error: "Playlist lookup not yet converted from Flask" },
                { status: 501 },
            )
        }

        return NextResponse.json({ error: "Not found" }, { status: 404 })
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        )
    }
}