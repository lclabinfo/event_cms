import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const pages = await prisma.eventPage.findMany({
      where: {
        eventId: params.eventId,
        isVisible: true
      },
      orderBy: {
        order: 'asc'
      }
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    // Check authentication and authorization
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // TODO: Check if user has permission to create pages for this event

    const body = await request.json();
    const { slug, title, content, order = 0, isVisible = true } = body;

    if (!slug || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, title, content' },
        { status: 400 }
      );
    }

    const page = await prisma.eventPage.create({
      data: {
        eventId: params.eventId,
        slug,
        title,
        content,
        order,
        isVisible
      }
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    // Check authentication and authorization
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, slug, title, content, order, isVisible } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Page ID is required' },
        { status: 400 }
      );
    }

    const page = await prisma.eventPage.update({
      where: {
        id,
        eventId: params.eventId
      },
      data: {
        ...(slug !== undefined && { slug }),
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(order !== undefined && { order }),
        ...(isVisible !== undefined && { isVisible })
      }
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    // Check authentication and authorization
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('id');

    if (!pageId) {
      return NextResponse.json(
        { error: 'Page ID is required' },
        { status: 400 }
      );
    }

    await prisma.eventPage.delete({
      where: {
        id: pageId,
        eventId: params.eventId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}