import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const menus = await prisma.eventMenu.findMany({
      where: {
        eventId: params.eventId,
        isVisible: true
      },
      orderBy: {
        order: 'asc'
      },
      include: {
        children: {
          where: {
            isVisible: true
          },
          orderBy: {
            order: 'asc'
          }
        },
        page: true
      }
    });

    return NextResponse.json(menus);
  } catch (error) {
    console.error('Error fetching menus:', error);
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

    // TODO: Check if user has permission to create menus for this event

    const body = await request.json();
    const {
      title,
      url,
      pageId,
      order = 0,
      parentId,
      isVisible = true,
      type = 'link',
      icon,
      target = '_self'
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const menu = await prisma.eventMenu.create({
      data: {
        eventId: params.eventId,
        title,
        url,
        pageId,
        order,
        parentId,
        isVisible,
        type,
        icon,
        target
      }
    });

    return NextResponse.json(menu, { status: 201 });
  } catch (error) {
    console.error('Error creating menu:', error);
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
    const {
      id,
      title,
      url,
      pageId,
      order,
      parentId,
      isVisible,
      type,
      icon,
      target
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Menu ID is required' },
        { status: 400 }
      );
    }

    const menu = await prisma.eventMenu.update({
      where: {
        id,
        eventId: params.eventId
      },
      data: {
        ...(title !== undefined && { title }),
        ...(url !== undefined && { url }),
        ...(pageId !== undefined && { pageId }),
        ...(order !== undefined && { order }),
        ...(parentId !== undefined && { parentId }),
        ...(isVisible !== undefined && { isVisible }),
        ...(type !== undefined && { type }),
        ...(icon !== undefined && { icon }),
        ...(target !== undefined && { target })
      }
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.error('Error updating menu:', error);
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
    const menuId = searchParams.get('id');

    if (!menuId) {
      return NextResponse.json(
        { error: 'Menu ID is required' },
        { status: 400 }
      );
    }

    // First, update children to have no parent
    await prisma.eventMenu.updateMany({
      where: {
        parentId: menuId
      },
      data: {
        parentId: null
      }
    });

    // Then delete the menu
    await prisma.eventMenu.delete({
      where: {
        id: menuId,
        eventId: params.eventId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting menu:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}