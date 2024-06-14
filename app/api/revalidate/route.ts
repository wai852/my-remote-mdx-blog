import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function GET(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret')
    //check is the user authorized 
    if (secret !== process.env.SECRET_TOKEN) {
        return new NextResponse(JSON.stringify({ message: 'Invalid Token' }), {
            status: 401,
            statusText: 'Unauthorized',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
    //get the path or home page, then revalidate the path
    const path = request.nextUrl.searchParams.get('path') || '/'

    if(path){
        console.log(path);
        revalidatePath(path);
        return NextResponse.json({ revalidated: true, now: Date.now() })
    }
    //revalidatePath(path, 'page');
    //return NextResponse.json({ revalidated: true })
}